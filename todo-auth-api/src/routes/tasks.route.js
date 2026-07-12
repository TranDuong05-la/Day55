const express = require('express');
const controller = require('../controllers/task.controller');
const authRequired = require('../middlewares/authRequired');

const router = express.Router();

router.get('/', controller.getAllTasks);
router.get('/:id', controller.getTaskById);
router.post('/', authRequired, controller.createTask);
router.put('/:id', authRequired, controller.updateTask);
router.delete('/:id', authRequired, controller.deleteTask);

module.exports = router;
