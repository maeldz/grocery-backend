module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      addressee: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ship_postal_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ship_street: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ship_street_n: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ship_neighborhood: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ship_city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ship_state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ship_complement: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ship_reference: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      delivery_fee: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      discount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      subtotal: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      total: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      payment_condition: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      cc_brand: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cc_last_4_digits: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      canceled_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('orders');
  },
};
