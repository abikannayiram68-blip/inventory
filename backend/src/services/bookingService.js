const { Op } = require('sequelize');
const { Booking, Room, Resource, User, sequelize } = require('../models');
const AppError = require('../utils/AppError');

const bookingInclude = [
  { model: User, attributes: ['id', 'name', 'email'] },
  { model: Room, attributes: ['id', 'name', 'capacity', 'floor_number'] },
  { model: Resource, attributes: ['id', 'name', 'type'], through: { attributes: [] } }
];

const validateTimeRange = (start_time, end_time) => {
  const start = new Date(start_time);
  const end = new Date(end_time);

  if (!start_time || !end_time || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new AppError('Valid start and end time are required', 400);
  }
  if (start < new Date()) {
    throw new AppError('Past dates cannot be booked', 400);
  }
  if (end <= start) {
    throw new AppError('End time must be after start time', 400);
  }

  return { start, end };
};

const ensureRoomAvailable = async (room_id, start, end, transaction) => {
  const room = await Room.findByPk(room_id, { transaction });
  if (!room) throw new AppError('Room not found', 404);
  if (room.availability_status !== 'available') throw new AppError('Room is unavailable', 400);

  const overlap = await Booking.findOne({
    where: {
      room_id,
      status: { [Op.in]: ['pending', 'approved'] },
      start_time: { [Op.lt]: end },
      end_time: { [Op.gt]: start }
    },
    transaction
  });

  if (overlap) {
    throw new AppError('Room is already booked for this time', 409);
  }
};

const createBooking = async (user, payload) => {
  const { room_id, resource_ids = [], notes, priority = 'normal' } = payload;
  if (!room_id) throw new AppError('Room is required', 400);
  const { start, end } = validateTimeRange(payload.start_time, payload.end_time);

  return sequelize.transaction(async (transaction) => {
    await ensureRoomAvailable(room_id, start, end, transaction);

    const resources = await Resource.findAll({
      where: { id: resource_ids, status: 'available' },
      transaction
    });

    if (resource_ids.length && resources.length !== resource_ids.length) {
      throw new AppError('One or more resources are unavailable', 400);
    }

    const booking = await Booking.create(
      { user_id: user.id, room_id, start_time: start, end_time: end, notes, priority },
      { transaction }
    );

    if (resources.length) {
      await booking.setResources(resources, { transaction });
    }

    return Booking.findByPk(booking.id, { include: bookingInclude, transaction });
  });
};

const listBookings = (user) => {
  const where = user.role === 'admin' ? {} : { user_id: user.id };
  return Booking.findAll({ where, include: bookingInclude, order: [['start_time', 'DESC']] });
};

const updateBookingStatus = async (id, status) => {
  if (!['approved', 'rejected'].includes(status)) {
    throw new AppError('Status must be approved or rejected', 400);
  }

  const booking = await Booking.findByPk(id);
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.status === 'cancelled') throw new AppError('Cancelled bookings cannot be updated', 400);

  await booking.update({ status });
  return Booking.findByPk(id, { include: bookingInclude });
};

const cancelBooking = async (id, user) => {
  const where = user.role === 'admin' ? { id } : { id, user_id: user.id };
  const booking = await Booking.findOne({ where });
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.status === 'cancelled') throw new AppError('Booking is already cancelled', 400);

  await booking.update({ status: 'cancelled' });
  return Booking.findByPk(id, { include: bookingInclude });
};

module.exports = { createBooking, listBookings, updateBookingStatus, cancelBooking };
