import Order from '../models/Order';
import OrderDetail from '../models/OrderDetail';

import Cache from '../../lib/Cache';

import AdminCheckService from '../../services/AdminCheckService';

class UserOrderController {
  async index(req, res) {
    if (req.userId !== Number(req.params.id)) {
      await AdminCheckService.run({ user_id: req.userId });
    }

    const cached = await Cache.get(`orders:users:${req.userId}`);

    if (cached) return res.json(cached);

    const orders = await Order.findAll({
      where: {
        user_id: req.userId,
      },
      attributes: [
        'id',
        'date',
        'user_id',
        'status',
        'ship_postal_code',
        'ship_street',
        'ship_street_n',
        'ship_neighborhood',
        'ship_city',
        'ship_state',
        'ship_complement',
        'ship_reference',
        'delivery_fee',
        'discount',
        'subtotal',
        'total',
      ],
      include: [
        {
          model: OrderDetail,
          as: 'order_details',
          attributes: ['product_id', 'quantity', 'price', 'total'],
        },
      ],
    });

    await Cache.set(`orders:users:${req.userId}`, orders);

    return res.json(orders);
  }
}

export default new UserOrderController();
