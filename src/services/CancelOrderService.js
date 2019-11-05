import db from '../database';

import Order from '../app/models/Order';
import User from '../app/models/User';

import Queue from '../lib/Queue';
import Cache from '../lib/Cache';

import OrderCancellationMail from '../app/jobs/OrderCancellationMail';

const sequelize = db.connection;

let transaction;

class CancelOrderService {
  async run({ order_id }) {
    try {
      transaction = await sequelize.transaction();

      const order = await Order.findByPk(order_id, {
        attributes: ['id', 'date', 'user_id', 'status', 'canceled_at'],
      });

      if (order.canceled_at) {
        throw new Error('This order has already been canceled');
      }

      order.canceled_at = new Date();
      order.status = 'cancelled';

      await order.save(transaction);

      const user = await User.findByPk(order.user_id);

      await Queue.add(OrderCancellationMail.key, {
        orderDetails: {
          user,
          orderNumber: order.id,
          orderDate: order.date,
        },
      });

      await Cache.invalidatePrefix('orders:users');

      await transaction.commit();

      return order;
    } catch (err) {
      if (transaction) await transaction.rollback();

      throw new Error(err);
    }
  }
}

export default new CancelOrderService();
