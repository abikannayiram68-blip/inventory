const bookingService = require('../services/bookingService');

const list = async (req, res, next) => {
  try {
    res.json(await bookingService.listBookings(req.user));
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    res.status(201).json(await bookingService.createBooking(req.user, req.body));
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    res.json(await bookingService.updateBookingStatus(req.params.id, req.body.status));
  } catch (error) {
    next(error);
  }
};

const cancel = async (req, res, next) => {
  try {
    res.json(await bookingService.cancelBooking(req.params.id, req.user));
  } catch (error) {
    next(error);
  }
};

module.exports = { list, create, updateStatus, cancel };
