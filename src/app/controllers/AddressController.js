import Address from '../models/Address';

import Cache from '../../lib/Cache';

class AddressController {
  async store(req, res) {
    const {
      postal_code,
      street,
      street_n,
      neighborhood,
      city,
      state,
      complement,
      reference,
    } = req.body;

    const { id } = await Address.create({
      user_id: req.userId,
      postal_code,
      street,
      street_n,
      neighborhood,
      city,
      state,
      complement,
      reference,
    });

    await Cache.invalidate(`adresses:users:${req.userId}`);

    return res.json({
      id,
      postal_code,
      street,
      street_n,
      neighborhood,
      city,
      state,
      complement,
      reference,
    });
  }

  async index(req, res) {
    const cached = await Cache.get(`adresses:users:${req.userId}`);

    if (cached) return res.json(cached);

    const address = await Address.findOne({
      where: {
        user_id: req.userId,
      },
      attributes: [
        'id',
        'user_id',
        'postal_code',
        'street',
        'street_n',
        'neighborhood',
        'city',
        'state',
        'complement',
        'reference',
      ],
    });

    await Cache.set(`adresses:users:${req.userId}`, address);

    return res.json(address);
  }

  async update(req, res) {
    const address = await Address.findOne({
      where: {
        user_id: req.userId,
      },
    });

    const {
      id,
      postal_code,
      street,
      street_n,
      neighborhood,
      city,
      state,
      complement,
      reference,
    } = await address.update(req.body);

    await Cache.invalidate(`adresses:users:${req.userId}`);

    return res.json({
      id,
      postal_code,
      street,
      street_n,
      neighborhood,
      city,
      state,
      complement,
      reference,
    });
  }
}

export default new AddressController();
