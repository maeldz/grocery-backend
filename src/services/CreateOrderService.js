import db from '../database';

import Order from '../app/models/Order';
import User from '../app/models/User';
import OrderDetail from '../app/models/OrderDetail';
import Product from '../app/models/Product';
import Category from '../app/models/Category';
import File from '../app/models/File';
import Setting from '../app/models/Setting';

import Queue from '../lib/Queue';
import Cache from '../lib/Cache';
import NewOrderMail from '../app/jobs/NewOrderMail';

const sequelize = db.connection;

let transaction;

class CreateOrderService {
  async run(data) {
    try {
      transaction = await sequelize.transaction();

      const {
        user_id,
        status,
        addressee,
        ship_postal_code,
        ship_street,
        ship_street_n,
        ship_neighborhood,
        ship_city,
        ship_state,
        ship_complement = null,
        ship_reference = null,
        delivery_fee = 0,
        discount = 0,
        payment_method,
        payment_condition = 0,
        cc_brand = null,
        cc_last_4_digits = null,
        products,
      } = data;

      const orderSubTotal = products.reduce((result, { total }) => {
        return result + total;
      }, 0);

      const orderTotal = orderSubTotal + delivery_fee - discount;

      const { id, date } = await Order.create(
        {
          date: new Date(),
          user_id,
          status,
          addressee,
          ship_postal_code,
          ship_street,
          ship_street_n,
          ship_neighborhood,
          ship_city,
          ship_state,
          ship_complement,
          ship_reference,
          delivery_fee,
          discount,
          subtotal: orderSubTotal,
          total: orderTotal,
          payment_method,
          payment_condition,
          cc_brand,
          cc_last_4_digits,
        },
        transaction,
      );

      // add order products to db

      await OrderDetail.bulkCreate(
        products.map(product => ({
          order_id: id,
          ...product,
        })),
      );

      const user = await User.findByPk(user_id);

      const settings = JSON.parse(JSON.stringify(await Setting.findAll()));

      // Get order complete details

      const orderProducts = await OrderDetail.findAll({
        where: {
          order_id: id,
        },
        attributes: ['quantity', 'price', 'total'],
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['name', 'quantity', 'unit'],
            include: [
              {
                model: File,
                as: 'image',
                attributes: ['path', 'url'],
              },
              {
                model: Category,
                as: 'category',
                attributes: ['name'],
              },
            ],
          },
        ],
      });

      // Organize products by categories

      const orderProductsGrouped = Object.values(
        orderProducts.reduce((result, { quantity, price, total, product }) => {
          // Create new group if necessary
          if (!result[product.category.name]) {
            result[product.category.name] = {
              category: product.category.name,
              products: [],
            };
          }

          // Append to group
          result[product.category.name].products.push({
            name: product.name,
            image: product.image,
            unit: product.unit,
            quantity: product.quantity,
            amount: quantity,
            price,
            total,
          });
          return result;
        }, {}),
      );

      const orderProductsCount = products.reduce((result, { quantity }) => {
        return result + quantity;
      }, 0);

      await Queue.add(NewOrderMail.key, {
        deliveryFeeLimit: JSON.parse(settings[0].delivery_fee)[1],
        orderDetails: {
          user,
          orderNumber: id,
          orderProductsGrouped,
          orderProductsCount,
          deliveryFee: delivery_fee,
          discount,
          orderSubTotal,
          orderTotal,
          orderDate: date,
          paymentDetails: {
            paymentMethod: payment_method,
            paymentCondition: payment_condition,
            creditCardBrand: cc_brand,
            creditCardLast4Digits: cc_last_4_digits,
          },
          shippingDetails: {
            addressee,
            postalCode: ship_postal_code,
            street: ship_street,
            streetN: ship_street_n,
            neighborhood: ship_neighborhood,
            city: ship_city,
            state: ship_state,
            complement: ship_complement,
            reference: ship_reference,
          },
        },
      });

      await Cache.invalidatePrefix('orders:users');

      await transaction.commit();

      return {
        id,
        date,
        user_id,
        status,
        addressee,
        ship_postal_code,
        ship_street,
        ship_street_n,
        ship_neighborhood,
        ship_city,
        ship_state,
        ship_complement,
        ship_reference,
        delivery_fee,
        discount,
        subtotal: orderSubTotal,
        total: orderTotal,
        payment_method,
        payment_condition,
        cc_brand,
        cc_last_4_digits,
        products: orderProductsGrouped,
      };
    } catch (err) {
      if (transaction) await transaction.rollback();
      throw new Error(err);
    }
  }
}

export default new CreateOrderService();
