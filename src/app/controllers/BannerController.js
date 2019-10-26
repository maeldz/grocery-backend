import Banner from '../models/Banner';
import File from '../models/File';

import Cache from '../../lib/Cache';

import AdminCheckService from '../../services/AdminCheckService';

class BannerController {
  async store(req, res) {
    await AdminCheckService.run({ user_id: req.userId });

    const banner = await Banner.create(req.body);

    await Cache.invalidate('banners');

    return res.json(banner);
  }

  async index(req, res) {
    const cached = await Cache.get('banners');

    if (cached) return res.json(cached);

    const banners = await Banner.findAll({
      attributes: ['id'],
      include: [
        {
          model: File,
          as: 'image',
          attributes: ['path', 'url'],
        },
      ],
    });

    await Cache.set('banners', banners);

    return res.json(banners);
  }

  async delete(req, res) {
    await AdminCheckService.run({ user_id: req.userId });

    await Banner.destroy({
      where: {
        id: req.params.id,
      },
    });

    await Cache.invalidate('banners');

    return res.json();
  }
}

export default new BannerController();
