const express = require('express');
const controller = require('../controllers/auth.controller');
const authRequired = require('../middlewares/authRequired');

const router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/refresh-token', controller.refreshToken);
router.post('/logout', authRequired, controller.logout);

module.exports = router;
