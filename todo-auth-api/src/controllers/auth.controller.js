const AuthService = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await AuthService.register({ email, password });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login({ email, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function refreshToken(req, res, next) {
  try {
    const { refresh_token } = req.body;
    const result = await AuthService.refreshToken(refresh_token);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    await AuthService.logout(req.token);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refreshToken, logout };
