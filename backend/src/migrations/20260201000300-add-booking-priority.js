'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('bookings', 'priority', {
      allowNull: false,
      defaultValue: 'normal',
      type: Sequelize.ENUM('normal', 'urgent')
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('bookings', 'priority');
  }
};
