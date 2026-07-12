const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const RevokedTokenModel = require('../models/revokedToken.model');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function toPublicUser(user) {
  return { id: user.id, email: user.email, created_at: user.created_at };
}

async function register({ email, password }) {
  if (!email || !password) {
    throw httpError(400, 'email and password are required');
  }

  const existing = await UserModel.findByEmail(email);
  if (existing) {
    throw httpError(409, 'Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await UserModel.create({ email, password: hashedPassword });

  return {
    user: toPublicUser(user),
    access_token: generateAccessToken(user.id),
    refresh_token: generateRefreshToken(user.id),
  };
}

async function login({ email, password }) {
  if (!email || !password) {
    throw httpError(400, 'email and password are required');
  }

  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw httpError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw httpError(401, 'Invalid email or password');
  }

  return {
    user: toPublicUser(user),
    access_token: generateAccessToken(user.id),
    refresh_token: generateRefreshToken(user.id),
  };
}

async function refreshToken(oldRefreshToken) {
  if (!oldRefreshToken) {
    throw httpError(400, 'refresh_token is required');
  }

  let payload;
  try {
    payload = verifyToken(oldRefreshToken);
  } catch (err) {
    throw httpError(401, 'Invalid or expired refresh token');
  }

  if (payload.type !== 'refresh') {
    throw httpError(401, 'Invalid or expired refresh token');
  }

  const isRevoked = await RevokedTokenModel.exists(oldRefreshToken);
  if (isRevoked) {
    throw httpError(401, 'Invalid or expired refresh token');
  }

  await RevokedTokenModel.add(oldRefreshToken);

  return {
    access_token: generateAccessToken(payload.sub),
    refresh_token: generateRefreshToken(payload.sub),
  };
}

async function logout(accessToken) {
  await RevokedTokenModel.add(accessToken);
}

module.exports = { register, login, refreshToken, logout };
