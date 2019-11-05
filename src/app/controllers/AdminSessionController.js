import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';

import AdminCheckService from '../../services/AdminCheckService';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: 'User not found',
      });
    }

    const checkPassword = await user.checkPassword(password);

    if (!checkPassword) {
      return res.status(401).json({
        error: 'Password does not match',
      });
    }

    const { id, name, last_name, phone, birthday, gender, cpf } = user;

    await AdminCheckService.run({ user_id: id });

    return res.json({
      user: { id, name, last_name, email, phone, birthday, gender, cpf },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
