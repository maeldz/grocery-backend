import Admin from '../models/Admin';
import User from '../models/User';

import Cache from '../../lib/Cache';

import AdminCheckService from '../../services/AdminCheckService';

class AdminController {
  async store(req, res) {
    await AdminCheckService.run({ user_id: req.userId });

    const alreadyIsAdminCheck = await Admin.findOne({
      where: {
        user_id: req.body.user_id,
      },
    });

    if (alreadyIsAdminCheck) {
      return res.status(401).json('User is already admin');
    }

    const { id, user_id } = await Admin.create(req.body);

    await Cache.invalidate('admins');

    return res.json({ id, user_id });
  }

  async index(req, res) {
    await AdminCheckService.run({ user_id: req.userId });

    const cached = await Cache.get('admins');

    if (cached) return res.json(cached);

    const admins = await Admin.findAll({
      attributes: ['id'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: [
            'id',
            'name',
            'last_name',
            'email',
            'phone',
            'birthday',
            'gender',
            'cpf',
          ],
        },
      ],
    });

    await Cache.set('admins', admins);

    return res.json(admins);
  }

  async delete(req, res) {
    await AdminCheckService.run({ user_id: req.userId });

    await Admin.destroy({
      where: {
        id: req.params.id,
      },
    });

    await Cache.invalidate('admins');

    return res.json();
  }
}

export default new AdminController();
