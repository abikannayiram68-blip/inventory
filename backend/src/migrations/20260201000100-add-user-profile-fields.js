'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'phone_number', { type: Sequelize.STRING });
    await queryInterface.addColumn('users', 'profile_image', { type: Sequelize.STRING });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'profile_image');
    await queryInterface.removeColumn('users', 'phone_number');
  }
};
