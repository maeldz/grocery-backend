import Sequelize, { Model } from 'sequelize';

class OrderDetail extends Model {
  static init(connection) {
    super.init(
      {
        quantity: Sequelize.INTEGER,
        price: Sequelize.FLOAT,
        total: Sequelize.FLOAT,
      },
      {
        sequelize: connection,
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Order, { foreignKey: 'order_id' });
    this.belongsTo(models.Product, {
      as: 'product',
      foreignKey: 'product_id',
    });
  }
}

export default OrderDetail;
