import Sequelize from 'sequelize';

import User from '../app/models/User';
import Admin from '../app/models/Admin';
import Address from '../app/models/Address';
import File from '../app/models/File';
import Banner from '../app/models/Banner';
import Category from '../app/models/Category';
import Product from '../app/models/Product';
import Order from '../app/models/Order';
import OrderDetail from '../app/models/OrderDetail';
import Offer from '../app/models/Offer';
import Setting from '../app/models/Setting';

import databaseConfig from '../config/database';

const models = [
  User,
  Admin,
  Address,
  File,
  Banner,
  Category,
  Product,
  Order,
  OrderDetail,
  Offer,
  Setting,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
