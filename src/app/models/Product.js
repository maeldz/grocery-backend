import Sequelize, { Model } from 'sequelize';

class Product extends Model {
  static init(connection) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        price: Sequelize.FLOAT,
        unit: Sequelize.STRING,
      },
      {
        sequelize: connection,
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { as: 'image', foreignKey: 'image_id' });
    this.belongsTo(models.Category, {
      as: 'category',
      foreignKey: 'category_id',
    });
  }
}

export default Product;
