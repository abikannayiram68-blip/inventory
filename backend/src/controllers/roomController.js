const roomService = require('../services/roomService');

const list = async (req, res, next) => {
  try {
    res.json(await roomService.listRooms());
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    res.status(201).json(await roomService.createRoom(req.body));
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    res.json(await roomService.updateRoom(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await roomService.deleteRoom(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { list, create, update, remove };
