const roomService = require('../backend/src/services/roomService');
const { Room, RoomType } = require('../backend/src/models');
const AppError = require('../backend/src/utils/AppError');

jest.mock('../backend/src/models');

const mockRoom = {
  id: 1, name: 'Board Room', capacity: 10,
  floor_number: 2, availability_status: 'available',
  update: jest.fn(), destroy: jest.fn(),
};

describe('RoomService', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  describe('listRooms()', () => {
    it('should return all rooms ordered by floor then name', async () => {
      Room.findAll.mockResolvedValue([mockRoom]);
      const result = await roomService.listRooms();
      expect(Room.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ order: [['floor_number', 'ASC'], ['name', 'ASC']] })
      );
      expect(result).toEqual([mockRoom]);
    });

    it('should return empty array when no rooms', async () => {
      Room.findAll.mockResolvedValue([]);
      expect(await roomService.listRooms()).toEqual([]);
    });
  });

  describe('getRoom()', () => {
    it('should return room by id', async () => {
      Room.findByPk.mockResolvedValue(mockRoom);
      expect(await roomService.getRoom(1)).toEqual(mockRoom);
    });

    it('should throw 404 if room not found', async () => {
      Room.findByPk.mockResolvedValue(null);
      await expect(roomService.getRoom(999))
        .rejects.toMatchObject({ statusCode: 404, message: 'Room not found' });
    });
  });

  describe('createRoom()', () => {
    it('should create and return room', async () => {
      Room.create.mockResolvedValue({ id: 2, name: 'New Room', capacity: 8, floor_number: 1 });
      const result = await roomService.createRoom({ name: 'New Room', capacity: 8, floor_number: 1 });
      expect(result.name).toBe('New Room');
    });

    it('should throw 400 if name missing', async () => {
      await expect(roomService.createRoom({ capacity: 5, floor_number: 1 }))
        .rejects.toMatchObject({ statusCode: 400 });
    });

    it('should throw 400 if capacity missing', async () => {
      await expect(roomService.createRoom({ name: 'Room', floor_number: 1 }))
        .rejects.toMatchObject({ statusCode: 400 });
    });

    it('should throw 400 if floor_number missing', async () => {
      await expect(roomService.createRoom({ name: 'Room', capacity: 5 }))
        .rejects.toMatchObject({ statusCode: 400 });
    });
  });

  describe('updateRoom()', () => {
    it('should update and return room', async () => {
      Room.findByPk
        .mockResolvedValueOnce(mockRoom)
        .mockResolvedValueOnce({ ...mockRoom, name: 'Updated' });
      mockRoom.update.mockResolvedValue();
      const result = await roomService.updateRoom(1, { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });

    it('should throw 404 if not found', async () => {
      Room.findByPk.mockResolvedValue(null);
      await expect(roomService.updateRoom(999, { name: 'X' }))
        .rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('deleteRoom()', () => {
    it('should delete the room', async () => {
      Room.findByPk.mockResolvedValue(mockRoom);
      mockRoom.destroy.mockResolvedValue();
      await roomService.deleteRoom(1);
      expect(mockRoom.destroy).toHaveBeenCalled();
    });

    it('should throw 404 if not found', async () => {
      Room.findByPk.mockResolvedValue(null);
      await expect(roomService.deleteRoom(999))
        .rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
