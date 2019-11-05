import Sequelize, { Model } from 'sequelize';

class Order extends Model {
  static init(connection) {
    super.init(
      {
        date: Sequelize.DATE,
        status: Sequelize.STRING,
        addressee: Sequelize.STRING,
        ship_postal_code: Sequelize.STRING,
        ship_street: Sequelize.STRING,
        ship_street_n: Sequelize.INTEGER,
        ship_neighborhood: Sequelize.STRING,
        ship_city: Sequelize.STRING,
        ship_state: Sequelize.STRING,
        ship_complement: Sequelize.STRING,
        ship_reference: Sequelize.STRING,
        delivery_fee: Sequelize.FLOAT,
        discount: Sequelize.FLOAT,
        subtotal: Sequelize.FLOAT,
        total: Sequelize.FLOAT,
        payment_method: Sequelize.STRING,
        payment_condition: Sequelize.INTEGER,
        cc_brand: Sequelize.STRING,
        cc_last_4_digits: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize: connection,
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.hasMany(models.OrderDetail, { as: 'order_details' });
  }
}

export default Order;
