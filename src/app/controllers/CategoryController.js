import Category from '../models/Category';

import Cache from '../../lib/Cache';

import AdminCheckService from '../../services/AdminCheckService';

class CategoryController {
  async store(req, res) {
    await AdminCheckService.run({ user_id: req.userId });

    const { id, name, image_id } = await Category.create(req.body);

    await Cache.invalidate('categories');

    return res.json({ id, name, image_id });
  }

  async index(req, res) {
    const cached = await Cache.get('categories');

    if (cached) return res.json(cached);

    const categories = await Category.findAll({
      attributes: ['id', 'name', 'image_id'],
    });

    await Cache.set('categories', categories);

    return res.json(categories);
  }

  async update(req, res) {
    await AdminCheckService.run({ user_id: req.userId });

    const category = await Category.findByPk(req.params.id);

    const { id, name, image_id } = await category.update(req.body);

    await Cache.invalidate('categories');

    return res.json({ id, name, image_id });
  }

  async delete(req, res) {
    await AdminCheckService.run({ user_id: req.userId });

    await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    await Cache.invalidate('categories');

    return res.json();
  }
}

export default new CategoryController();
