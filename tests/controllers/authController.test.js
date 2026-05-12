const authController = require('../backend/src/controllers/authController');
const authService = require('../backend/src/services/authService');

jest.mock('../backend/src/services/authService');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('AuthController', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = mockRes();
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('register()', () => {
    it('should respond 201 on success', async () => {
      const mockResult = { user: { id: 1, name: 'John' }, token: 'token123' };
      authService.register.mockResolvedValue(mockResult);
      req.body = { name: 'John', email: 'john@example.com', password: 'pass' };
      await authController.register(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should call next(error) when service throws', async () => {
      authService.register.mockRejectedValue(new Error('Email taken'));
      await authController.register(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('login()', () => {
    it('should respond with user and token', async () => {
      authService.login.mockResolvedValue({ user: { id: 1 }, token: 'jwt' });
      await authController.login(req, res, next);
      expect(res.json).toHaveBeenCalled();
    });

    it('should call next(error) on failure', async () => {
      authService.login.mockRejectedValue(new Error('Invalid'));
      await authController.login(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('logout()', () => {
    it('should respond with logout message containing token', () => {
      authController.logout(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('token') })
      );
    });
  });
});
