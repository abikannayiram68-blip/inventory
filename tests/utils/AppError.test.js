const AppError = require('../backend/src/utils/AppError');

describe('AppError', () => {
  it('should create error with message and statusCode', () => {
    const err = new AppError('Not found', 404);
    expect(err.message).toBe('Not found');
    expect(err.statusCode).toBe(404);
    expect(err.isOperational).toBe(true);
  });

  it('should default statusCode to 500', () => {
    const err = new AppError('Server error');
    expect(err.statusCode).toBe(500);
  });

  it('should be instance of Error', () => {
    expect(new AppError('test')).toBeInstanceOf(Error);
  });

  it('should mark isOperational true', () => {
    expect(new AppError('oops', 400).isOperational).toBe(true);
  });
});
