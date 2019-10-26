import File from '../models/File';

class FileController {
  async store(req, res) {
    const { filename: path, originalname: name } = req.file;

    const { id } = await File.create({
      name,
      path,
    });
    return res.json({ id, name, path });
  }
}

export default new FileController();
