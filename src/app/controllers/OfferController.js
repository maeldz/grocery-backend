import { addDays } from 'date-fns';

import Offer from '../models/Offer';
import Product from '../models/Product';
import File from '../models/File';
import Category from '../models/Category';

import Cache from '../../lib/Cache';

import AdminCheckService from '../../services/AdminCheckService';

class OfferController {
  async store(req, res) {
    await AdminCheckService.run({ user_id: req.userId });

    const { product_id, quantity, unit, from, to } = req.body;

    const expiration_date = addDays(new Date(), req.body.expires_in);

    const { id } = await Offer.create({
      product_id,
      quantity,
      unit,
      from,
      to,
      expiration_date,
    });

    await Cache.invalidate('offers');

    return res.json({
      id,
      product_id,
      quantity,
      unit,
      from,
      to,
      expiration_date,
    });
  }

  async index(req, res) {
    const cached = await Cache.get('offers');

    if (cached) return res.json(cached);

    const offers = await Offer.findAll({
      attributes: [
        'id',
        'product_id',
        'quantity',
        'unit',
        'from',
        'to',
        'expiration_date',
      ],
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['name', 'description', 'price'],
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

    await Cache.set('offers', offers);

    return res.json(offers);
  }

  async update(req, res) {
    await AdminCheckService.run({ user_id: req.userId });

    const offer = await Offer.findByPk(req.params.id);

    const {
      id,
      expiration_date,
      quantity,
      unit,
      from,
      to,
    } = await offer.update(req.body);

    await Cache.invalidate('offers');

    return res.json({
      id,
      quantity,
      unit,
      from,
      to,
      expiration_date,
    });
  }

  async delete(req, res) {
    await AdminCheckService.run({ user_id: req.userId });

    await Offer.destroy({
      where: {
        id: req.params.id,
      },
    });

    await Cache.invalidate('offers');

    return res.json();
  }
}

export default new OfferController();
