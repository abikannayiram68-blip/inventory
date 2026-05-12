'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'deleted_at', { type: Sequelize.DATE });
    await queryInterface.addColumn('rooms', 'deleted_at', { type: Sequelize.DATE });
    await queryInterface.addColumn('resources', 'deleted_at', { type: Sequelize.DATE });
    await queryInterface.addColumn('bookings', 'deleted_at', { type: Sequelize.DATE });
    await queryInterface.addColumn('room_types', 'deleted_at', { type: Sequelize.DATE });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('room_types', 'deleted_at');
    await queryInterface.removeColumn('bookings', 'deleted_at');
    await queryInterface.removeColumn('resources', 'deleted_at');
    await queryInterface.removeColumn('rooms', 'deleted_at');
    await queryInterface.removeColumn('users', 'deleted_at');
  }
};
