import File from '../models/File';

class FileController {
  async store(req, res) {
    const { filename: path, originalname: name } = req.file;

    const { id, url } = await File.create({
      name,
      path,
    });
    return res.json({ id, url });
  }
}

export default new FileController();
