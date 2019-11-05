import Sequelize, { Model } from 'sequelize';

class Category extends Model {
  static init(connection) {
    super.init(
      {
        name: Sequelize.STRING,
      },
      {
        sequelize: connection,
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'image_id', as: 'image' });
  }
}

export default Category;
