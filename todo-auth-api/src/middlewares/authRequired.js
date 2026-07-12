const { verifyToken } = require('../utils/jwt');
const RevokedTokenModel = require('../models/revokedToken.model');

async function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.slice('Bearer '.length);

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  if (payload.type !== 'access') {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  const isRevoked = await RevokedTokenModel.exists(token);
  if (isRevoked) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  req.user = { id: payload.sub };
  req.token = token;
  next();
}

module.exports = authRequired;
