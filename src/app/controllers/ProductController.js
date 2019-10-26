import Product from '../models/Product';

import Cache from '../../lib/Cache';

import AdminCheckService from '../../services/AdminCheckService';

class ProductController {
  async store(req, res) {
    await AdminCheckService.run({ user_id: req.userId });

    const {
      id,
      name,
      description,
      unit,
      image_id,
      category_id,
      price,
    } = await Product.create(req.body);

    await Cache.invalidate('products');

    return res.json({
      id,
      name,
      description,
      unit,
      image_id,
      category_id,
      price,
    });
  }

  async index(req, res) {
    const cached = await Cache.get('products');

    if (cached) return res.json(cached);

    const products = await Product.findAll({
      attributes: [
        'id',
        'name',
        'description',
        'unit',
        'image_id',
        'category_id',
        'price',
      ],
    });

    await Cache.set('products', products);

    return res.json(products);
  }

  async update(req, res) {
    await AdminCheckService.run({ user_id: req.userId });

    const product = await Product.findByPk(req.params.id);

    await Cache.invalidate('products');

    const {
      id,
      name,
      description,
      image_id,
      category_id,
      price,
    } = await product.update(req.body);

    return res.json({
      id,
      name,
      description,
      image_id,
      category_id,
      price,
    });
  }

  async delete(req, res) {
    await AdminCheckService.run({ user_id: req.userId });

    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    await Cache.invalidate('products');

    return res.json();
  }
}

export default new ProductController();
