'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rooms', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { allowNull: false, type: Sequelize.STRING },
      capacity: { allowNull: false, type: Sequelize.INTEGER },
      floor_number: { allowNull: false, type: Sequelize.INTEGER },
      has_projector: { allowNull: false, defaultValue: false, type: Sequelize.BOOLEAN },
      availability_status: {
        allowNull: false,
        defaultValue: 'available',
        type: Sequelize.ENUM('available', 'unavailable')
      },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('rooms');
  }
};
