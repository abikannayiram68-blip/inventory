const bcrypt = require('bcryptjs');
const { User } = require('../models');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/jwt');

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone_number: user.phone_number,
  profile_image: user.profile_image
});

const register = async ({ name, email, password, phone_number, profile_image }) => {
  if (!name || !email || !password) {
    throw new AppError('Name, email, and password are required', 400);
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new AppError('Email is already registered', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'employee',
    phone_number,
    profile_image
  });

  return { user: sanitizeUser(user), token: signToken(user) };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const user = await User.findOne({ where: { email } });
  const isValidPassword = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !isValidPassword) {
    throw new AppError('Invalid email or password', 401);
  }

  return { user: sanitizeUser(user), token: signToken(user) };
};

module.exports = { register, login };
