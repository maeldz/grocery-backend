import Admin from '../app/models/Admin';
import User from '../app/models/User';

import Cache from '../lib/Cache';

class AdminCheckService {
  async run({ user_id }) {
    const cached = await Cache.get('admins');

    if (cached) {
      const isAdmin = cached.findIndex(admin => admin.user.id === user_id);

      if (isAdmin >= 0) return true;

      throw new Error('Permission denied. Could not perform this operation');
    }

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

    const isAdmin = admins.findIndex(admin => admin.user.id === user_id);

    if (isAdmin < 0)
      throw new Error('Permission denied. Could not perform this operation');

    return true;
  }
}

export default new AdminCheckService();
