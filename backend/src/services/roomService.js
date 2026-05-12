const { Room, RoomType } = require('../models');
const AppError = require('../utils/AppError');

const include = [{ model: RoomType, attributes: ['id', 'name'] }];

const listRooms = () => Room.findAll({ include, order: [['floor_number', 'ASC'], ['name', 'ASC']] });

const getRoom = async (id) => {
  const room = await Room.findByPk(id, { include });
  if (!room) throw new AppError('Room not found', 404);
  return room;
};

const createRoom = (payload) => {
  if (!payload.name || !payload.capacity || payload.floor_number === undefined) {
    throw new AppError('Room name, capacity, and floor number are required', 400);
  }
  return Room.create(payload);
};

const updateRoom = async (id, payload) => {
  const room = await getRoom(id);
  await room.update(payload);
  return getRoom(id);
};

const deleteRoom = async (id) => {
  const room = await getRoom(id);
  await room.destroy();
};

module.exports = { listRooms, getRoom, createRoom, updateRoom, deleteRoom };
