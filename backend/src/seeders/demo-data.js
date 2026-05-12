'use strict';

const bcrypt = require('bcryptjs');
const { QueryTypes } = require('sequelize');

const getExistingValues = async (queryInterface, table, column, values) => {
  const rows = await queryInterface.sequelize.query(
    `SELECT ${column} FROM ${table} WHERE ${column} IN (:values)`,
    {
      replacements: { values },
      type: QueryTypes.SELECT
    }
  );

  return new Set(rows.map((row) => row[column]));
};

const insertMissing = async (queryInterface, table, column, rows) => {
  const existing = await getExistingValues(queryInterface, table, column, rows.map((row) => row[column]));
  const missing = rows.filter((row) => !existing.has(row[column]));

  if (missing.length) {
    await queryInterface.bulkInsert(table, missing);
  }
};

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const adminPassword = await bcrypt.hash('Admin@1234', 10);
    const employeePassword = await bcrypt.hash('Employee@123', 10);

    await insertMissing(queryInterface, 'users', 'email', [
      {
        name: 'Admin User',
        email: 'admin@company.com',
        password: adminPassword,
        role: 'admin',
        phone_number: '9999999999',
        profile_image: null,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Employee User',
        email: 'employee@company.com',
        password: employeePassword,
        role: 'employee',
        phone_number: '8888888888',
        profile_image: null,
        created_at: now,
        updated_at: now
      }
    ]);

    await insertMissing(queryInterface, 'room_types', 'name', [
      { name: 'Conference Room', created_at: now, updated_at: now },
      { name: 'Interview Room', created_at: now, updated_at: now },
      { name: 'Training Room', created_at: now, updated_at: now }
    ]);

    const roomTypes = await queryInterface.sequelize.query(
      'SELECT id, name FROM room_types WHERE name IN (:names)',
      {
        replacements: { names: ['Conference Room', 'Interview Room', 'Training Room'] },
        type: QueryTypes.SELECT
      }
    );
    const roomTypeIds = Object.fromEntries(roomTypes.map((roomType) => [roomType.name, roomType.id]));

    await insertMissing(queryInterface, 'rooms', 'name', [
      {
        name: 'Orion',
        capacity: 12,
        floor_number: 3,
        has_projector: true,
        availability_status: 'available',
        room_type_id: roomTypeIds['Conference Room'],
        created_at: now,
        updated_at: now
      },
      {
        name: 'Nova',
        capacity: 4,
        floor_number: 2,
        has_projector: false,
        availability_status: 'available',
        room_type_id: roomTypeIds['Interview Room'],
        created_at: now,
        updated_at: now
      },
      {
        name: 'Atlas',
        capacity: 30,
        floor_number: 5,
        has_projector: true,
        availability_status: 'available',
        room_type_id: roomTypeIds['Training Room'],
        created_at: now,
        updated_at: now
      }
    ]);

    await insertMissing(queryInterface, 'resources', 'name', [
      { name: 'Epson Projector', type: 'Projector', quantity: 3, status: 'available', created_at: now, updated_at: now },
      { name: 'JBL Speaker Set', type: 'Speaker', quantity: 2, status: 'available', created_at: now, updated_at: now },
      { name: 'USB-C HDMI Adapter', type: 'Adapter', quantity: 8, status: 'available', created_at: now, updated_at: now },
      { name: 'Logitech Conference Cam', type: 'Camera', quantity: 2, status: 'available', created_at: now, updated_at: now }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('resources', null, {});
    await queryInterface.bulkDelete('rooms', null, {});
    await queryInterface.bulkDelete('room_types', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
