const TaskModel = require('../models/task.model');

function parseId(rawId) {
  const id = Number(rawId);
  return Number.isInteger(id) ? id : null;
}

async function getAllTasks(req, res, next) {
  try {
    const tasks = await TaskModel.findAll();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

async function getTaskById(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(404).json({ message: 'Task not found' });

    const task = await TaskModel.findOne(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function createTask(req, res, next) {
  try {
    if (!req.body.title) {
      return res.status(400).json({ message: 'title is required' });
    }
    const task = await TaskModel.create({ title: req.body.title });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(404).json({ message: 'Task not found' });

    const existing = await TaskModel.findOne(id);
    if (!existing) return res.status(404).json({ message: 'Task not found' });

    await TaskModel.update(id, {
      title: req.body.title,
      completed: req.body.completed,
    });
    const task = await TaskModel.findOne(id);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(404).json({ message: 'Task not found' });

    const affectedRows = await TaskModel.destroy(id);
    if (affectedRows === 0) return res.status(404).json({ message: 'Task not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
