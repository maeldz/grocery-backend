import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Mail from '../../lib/Mail';
import formatPrice from '../../util/format';

class NewOrderMail {
  get key() {
    return 'NewOrderMail';
  }

  async handle({ data }) {
    const { orderDetails, deliveryFeeLimit } = data;
    const orderTotal = parseFloat(orderDetails.orderTotal).toFixed(2);
    const orderSubTotal = parseFloat(orderDetails.orderSubTotal).toFixed(2);
    const deliveryFee = parseFloat(orderDetails.deliveryFee).toFixed(2);
    const discount = parseFloat(orderDetails.discount).toFixed(2);
    const orderDate = format(parseISO(orderDetails.orderDate), 'PPPpp', {
      locale: ptBR,
    });

    await Mail.sendMail({
      to: `${orderDetails.user.name} <${orderDetails.user.email}>`,
      subject: 'Confirmação de compra',
      template: 'newOrder',
      context: {
        user: orderDetails.user.name,
        orderDate,
        orderNumber: orderDetails.orderNumber,
        payment_method: orderDetails.payment_method,
        payment_condition: orderDetails.payment_condition,
        discount,
        deliveryFeeLimit,
        deliveryFee,
        orderSubTotal,
        orderTotal,
        paymentMethod: orderDetails.paymentDetails.paymentMethod,
        paymentCondition: orderDetails.paymentDetails.paymentCondition,
        creditCardBrand: orderDetails.paymentDetails.creditCardBrand,
        creditCardLast4Digits:
          orderDetails.paymentDetails.creditCardLast4Digits,
        orderProducts: orderDetails.orderProductsGrouped.map(category => ({
          ...category,
          products: category.products.map(p => ({
            ...p,
            image_url: p.image.url,
            price: formatPrice(p.price),
            total: formatPrice(p.total),
          })),
        })),
        orderProductsCount: orderDetails.orderProductsCount,
        orderName: orderDetails.shippingDetails.name,
        postalCode: orderDetails.shippingDetails.postalCode,
        street: orderDetails.shippingDetails.street,
        streetN: orderDetails.shippingDetails.streetN,
        neighborhood: orderDetails.shippingDetails.neighborhood,
        city: orderDetails.shippingDetails.city,
        state: orderDetails.shippingDetails.state,
        complement: orderDetails.shippingDetails.complement,
        reference: orderDetails.shippingDetails.reference,
      },
    });
  }
}

export default new NewOrderMail();
