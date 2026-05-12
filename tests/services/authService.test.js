const authService = require('../backend/src/services/authService');
const { User } = require('../backend/src/models');
const bcrypt = require('bcryptjs');
const { signToken } = require('../backend/src/utils/jwt');
const AppError = require('../backend/src/utils/AppError');

jest.mock('../backend/src/models');
jest.mock('bcryptjs');
jest.mock('../backend/src/utils/jwt');

describe('AuthService', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  describe('register()', () => {
    const validPayload = { name: 'John', email: 'john@example.com', password: 'secret123' };

    it('should register user and return token', async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed_pw');
      User.create.mockResolvedValue({ id: 1, name: 'John', email: 'john@example.com', role: 'employee', phone_number: null, profile_image: null });
      signToken.mockReturnValue('jwt_token');

      const result = await authService.register(validPayload);
      expect(result.token).toBe('jwt_token');
      expect(result.user.email).toBe('john@example.com');
    });

    it('should throw 400 if name missing', async () => {
      await expect(authService.register({ email: 'a@b.com', password: '123' }))
        .rejects.toMatchObject({ statusCode: 400 });
    });

    it('should throw 400 if email missing', async () => {
      await expect(authService.register({ name: 'John', password: '123' }))
        .rejects.toMatchObject({ statusCode: 400 });
    });

    it('should throw 400 if password missing', async () => {
      await expect(authService.register({ name: 'John', email: 'a@b.com' }))
        .rejects.toMatchObject({ statusCode: 400 });
    });

    it('should throw 409 if email already exists', async () => {
      User.findOne.mockResolvedValue({ id: 1 });
      await expect(authService.register(validPayload))
        .rejects.toMatchObject({ statusCode: 409, message: 'Email is already registered' });
    });

    it('should not return password in response', async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed_pw');
      User.create.mockResolvedValue({ id: 1, name: 'John', email: 'john@example.com', role: 'employee', phone_number: null, profile_image: null });
      signToken.mockReturnValue('token');
      const result = await authService.register(validPayload);
      expect(result.user).not.toHaveProperty('password');
    });
  });

  describe('login()', () => {
    const mockUser = { id: 1, name: 'John', email: 'john@example.com', password: 'hashed_pw', role: 'employee', phone_number: null, profile_image: null };

    it('should return user and token on valid login', async () => {
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      signToken.mockReturnValue('jwt_token');
      const result = await authService.login({ email: 'john@example.com', password: 'secret' });
      expect(result.token).toBe('jwt_token');
    });

    it('should throw 400 if email missing', async () => {
      await expect(authService.login({ password: '123' }))
        .rejects.toMatchObject({ statusCode: 400 });
    });

    it('should throw 400 if password missing', async () => {
      await expect(authService.login({ email: 'a@b.com' }))
        .rejects.toMatchObject({ statusCode: 400 });
    });

    it('should throw 401 if user not found', async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.compare.mockResolvedValue(false);
      await expect(authService.login({ email: 'no@user.com', password: 'abc' }))
        .rejects.toMatchObject({ statusCode: 401, message: 'Invalid email or password' });
    });

    it('should throw 401 if password wrong', async () => {
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);
      await expect(authService.login({ email: 'john@example.com', password: 'wrong' }))
        .rejects.toMatchObject({ statusCode: 401 });
    });

    it('should not return password in response', async () => {
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      signToken.mockReturnValue('token');
      const result = await authService.login({ email: 'john@example.com', password: 'secret' });
      expect(result.user).not.toHaveProperty('password');
    });
  });
});
