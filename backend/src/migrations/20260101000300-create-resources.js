'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('resources', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { allowNull: false, type: Sequelize.STRING },
      type: { allowNull: false, type: Sequelize.STRING },
      quantity: { allowNull: false, defaultValue: 1, type: Sequelize.INTEGER },
      status: {
        allowNull: false,
        defaultValue: 'available',
        type: Sequelize.ENUM('available', 'unavailable', 'maintenance')
      },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('resources');
  }
};
