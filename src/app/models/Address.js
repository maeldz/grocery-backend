import Sequelize, { Model } from 'sequelize';

class Address extends Model {
  static init(connection) {
    super.init(
      {
        ship_postal_code: Sequelize.STRING,
        ship_street: Sequelize.STRING,
        ship_street_n: Sequelize.STRING,
        ship_neighborhood: Sequelize.STRING,
        ship_city: Sequelize.STRING,
        ship_state: Sequelize.STRING,
        complement: Sequelize.STRING,
        reference: Sequelize.STRING,
      },
      {
        sequelize: connection,
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

export default Address;
