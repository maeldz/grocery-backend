import Sequelize, { Model } from 'sequelize';

class Address extends Model {
  static init(connection) {
    super.init(
      {
        postal_code: Sequelize.STRING,
        street: Sequelize.STRING,
        street_n: Sequelize.STRING,
        neighborhood: Sequelize.STRING,
        city: Sequelize.STRING,
        state: Sequelize.STRING,
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
