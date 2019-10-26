import Sequelize, { Model } from 'sequelize';

class Offer extends Model {
  static init(connection) {
    super.init(
      {
        quantity: Sequelize.INTEGER,
        unit: Sequelize.STRING,
        from: Sequelize.FLOAT,
        to: Sequelize.FLOAT,
        expiration_date: Sequelize.DATE,
      },
      {
        sequelize: connection,
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Product, { as: 'product', foreignKey: 'product_id' });
  }
}

export default Offer;
