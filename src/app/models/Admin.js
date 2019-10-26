import { Model } from 'sequelize';

class Admin extends Model {
  static init(connection) {
    super.init(
      {},
      {
        sequelize: connection,
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
  }
}

export default Admin;
