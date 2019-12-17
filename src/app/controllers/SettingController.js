import Setting from '../models/Setting';

import Cache from '../../lib/Cache';

import AdminCheckService from '../../services/AdminCheckService';

class SettingController {
  async store(req, res) {
    await AdminCheckService.run({ user_id: req.userId });

    const settings = await Setting.findAll();

    if (settings.length) {
      return res
        .status(400)
        .json({ error: 'Settings have already been created' });
    }

    const createSettings = await Setting.create(req.body);

    return res.json(createSettings);
  }

  async index(req, res) {
    const cached = await Cache.get('settings');

    if (cached) return res.json(cached);

    const settings = await Setting.findAll();

    await Cache.set('settings', settings);

    return res.json(settings);
  }

  async update(req, res) {
    await AdminCheckService.run({ user_id: req.userId });

    const settings = await Setting.findByPk(1);

    const settingsUpdated = await settings.update(req.body);

    await Cache.invalidate('settings');

    return res.json(settingsUpdated);
  }
}

export default new SettingController();
