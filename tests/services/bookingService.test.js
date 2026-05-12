const bookingService = require('../backend/src/services/bookingService');
const { Booking, Room, Resource, User, sequelize } = require('../backend/src/models');
const AppError = require('../backend/src/utils/AppError');

jest.mock('../backend/src/models');

const future = (hours = 2) => new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

describe('BookingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sequelize.transaction.mockImplementation((cb) => cb('tx'));
  });

  describe('createBooking() - validation', () => {
    const user = { id: 1, role: 'admin' };

    it('should throw 400 if start_time missing', async () => {
      await expect(bookingService.createBooking(user, { room_id: 1, end_time: future() }))
        .rejects.toMatchObject({ statusCode: 400 });
    });

    it('should throw 400 if end_time missing', async () => {
      await expect(bookingService.createBooking(user, { room_id: 1, start_time: future() }))
        .rejects.toMatchObject({ statusCode: 400 });
    });

    it('should throw 400 for past start_time', async () => {
      const past = new Date(Date.now() - 3600000).toISOString();
      await expect(bookingService.createBooking(user, { room_id: 1, start_time: past, end_time: future() }))
        .rejects.toMatchObject({ statusCode: 400, message: 'Past dates cannot be booked' });
    });

    it('should throw 400 if end before start', async () => {
      await expect(bookingService.createBooking(user, { room_id: 1, start_time: future(4), end_time: future(2) }))
        .rejects.toMatchObject({ statusCode: 400, message: 'End time must be after start time' });
    });

    it('should throw 400 if room_id missing', async () => {
      await expect(bookingService.createBooking(user, { start_time: future(), end_time: future(3) }))
        .rejects.toMatchObject({ statusCode: 400, message: 'Room is required' });
    });
  });

  describe('createBooking() - room checks', () => {
    const user = { id: 2, role: 'employee' };
    const mockRoom = { id: 1, name: 'Room A', availability_status: 'available' };
    const mockBooking = { id: 10, setResources: jest.fn() };

    beforeEach(() => {
      Room.findByPk.mockResolvedValue(mockRoom);
      Booking.findOne.mockResolvedValue(null);
      Resource.findAll.mockResolvedValue([]);
      Booking.create.mockResolvedValue(mockBooking);
      Booking.findByPk.mockResolvedValue({ id: 10 });
    });

    it('should create booking successfully', async () => {
      await bookingService.createBooking(user, { room_id: 1, start_time: future(1), end_time: future(3) });
      expect(Booking.create).toHaveBeenCalled();
    });

    it('should throw 404 if room not found', async () => {
      Room.findByPk.mockResolvedValue(null);
      await expect(bookingService.createBooking(user, { room_id: 999, start_time: future(), end_time: future(2) }))
        .rejects.toMatchObject({ statusCode: 404, message: 'Room not found' });
    });

    it('should throw 400 if room unavailable', async () => {
      Room.findByPk.mockResolvedValue({ ...mockRoom, availability_status: 'maintenance' });
      await expect(bookingService.createBooking(user, { room_id: 1, start_time: future(), end_time: future(2) }))
        .rejects.toMatchObject({ statusCode: 400, message: 'Room is unavailable' });
    });

    it('should throw 409 if slot already booked', async () => {
      Booking.findOne.mockResolvedValue({ id: 5 });
      await expect(bookingService.createBooking(user, { room_id: 1, start_time: future(), end_time: future(2) }))
        .rejects.toMatchObject({ statusCode: 409, message: 'Room is already booked for this time' });
    });

    it('should throw 400 if resource unavailable', async () => {
      Resource.findAll.mockResolvedValue([{ id: 1 }]);
      await expect(bookingService.createBooking(user, { room_id: 1, resource_ids: [1, 2], start_time: future(), end_time: future(2) }))
        .rejects.toMatchObject({ statusCode: 400, message: 'One or more resources are unavailable' });
    });
  });

  describe('listBookings()', () => {
    it('should return all bookings for admin', async () => {
      Booking.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      await bookingService.listBookings({ role: 'admin', id: 1 });
      expect(Booking.findAll).toHaveBeenCalledWith(expect.objectContaining({ where: {} }));
    });

    it('should return own bookings for employee', async () => {
      Booking.findAll.mockResolvedValue([{ id: 3 }]);
      await bookingService.listBookings({ role: 'employee', id: 5 });
      expect(Booking.findAll).toHaveBeenCalledWith(expect.objectContaining({ where: { user_id: 5 } }));
    });
  });

  describe('updateBookingStatus()', () => {
    const mockBooking = { id: 1, status: 'pending', update: jest.fn() };

    beforeEach(() => { Booking.findByPk.mockResolvedValueOnce(mockBooking); });

    it('should approve booking', async () => {
      mockBooking.update.mockResolvedValue();
      Booking.findByPk.mockResolvedValue({ id: 1, status: 'approved' });
      await bookingService.updateBookingStatus(1, 'approved');
      expect(mockBooking.update).toHaveBeenCalledWith({ status: 'approved' });
    });

    it('should throw 400 for invalid status', async () => {
      await expect(bookingService.updateBookingStatus(1, 'completed'))
        .rejects.toMatchObject({ statusCode: 400, message: 'Status must be approved or rejected' });
    });

    it('should throw 404 if not found', async () => {
      Booking.findByPk.mockReset();
      Booking.findByPk.mockResolvedValue(null);
      await expect(bookingService.updateBookingStatus(999, 'approved'))
        .rejects.toMatchObject({ statusCode: 404 });
    });

    it('should throw 400 if already cancelled', async () => {
      Booking.findByPk.mockReset();
      Booking.findByPk.mockResolvedValue({ id: 1, status: 'cancelled', update: jest.fn() });
      await expect(bookingService.updateBookingStatus(1, 'approved'))
        .rejects.toMatchObject({ statusCode: 400, message: 'Cancelled bookings cannot be updated' });
    });
  });

  describe('cancelBooking()', () => {
    const mockBooking = { id: 1, status: 'pending', update: jest.fn() };

    it('should cancel booking', async () => {
      Booking.findOne.mockResolvedValue(mockBooking);
      mockBooking.update.mockResolvedValue();
      Booking.findByPk.mockResolvedValue({ id: 1, status: 'cancelled' });
      await bookingService.cancelBooking(1, { role: 'admin', id: 99 });
      expect(mockBooking.update).toHaveBeenCalledWith({ status: 'cancelled' });
    });

    it('should throw 404 if not found', async () => {
      Booking.findOne.mockResolvedValue(null);
      await expect(bookingService.cancelBooking(999, { role: 'employee', id: 5 }))
        .rejects.toMatchObject({ statusCode: 404, message: 'Booking not found' });
    });

    it('should throw 400 if already cancelled', async () => {
      Booking.findOne.mockResolvedValue({ id: 1, status: 'cancelled' });
      await expect(bookingService.cancelBooking(1, { role: 'employee', id: 5 }))
        .rejects.toMatchObject({ statusCode: 400, message: 'Booking is already cancelled' });
    });
  });
});
