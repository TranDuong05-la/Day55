const express = require('express');
const authRoute = require('./auth.route');
const tasksRoute = require('./tasks.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/api/tasks', tasksRoute);

module.exports = router;
