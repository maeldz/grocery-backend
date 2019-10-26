import User from '../models/User';

import Cache from '../../lib/Cache';

import AdminCheckService from '../../services/AdminCheckService';

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const {
      id,
      name,
      last_name,
      email,
      phone,
      birthday,
      gender,
      cpf,
    } = await User.create(req.body);

    await Cache.invalidate('users');

    return res.json({
      id,
      name,
      last_name,
      email,
      phone,
      birthday,
      gender,
      cpf,
    });
  }

  async index(req, res) {
    await AdminCheckService.run({ user_id: req.userId });

    const cached = await Cache.get('users');

    if (cached) return res.json(cached);

    const users = await User.findAll({
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
    });

    await Cache.set('users', users);

    return res.json(users);
  }

  async update(req, res) {
    if (req.body.user_id && req.userId !== req.body.user_id) {
      await AdminCheckService.run({ user_id: req.userId });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(
      req.body.user_id ? req.body.user_id : req.userId,
    );

    if (email !== user.email) {
      const userExists = await User.findOne({
        where: {
          email,
        },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const {
      id,
      name,
      last_name,
      phone,
      birthday,
      gender,
      cpf,
    } = await user.update(req.body);

    await Cache.invalidate('users');

    return res.json({
      id,
      name,
      last_name,
      email,
      phone,
      birthday,
      gender,
      cpf,
    });
  }
}

export default new UserController();
