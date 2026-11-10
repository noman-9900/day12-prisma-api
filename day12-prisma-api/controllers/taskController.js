
const taskService = require("../services/taskService");

// Create Task
async function createTask(req, res, next) {
  try {
    const task = await taskService.createTask(req.body, req.user);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
}

// Get All Tasks
async function getTasks(req, res, next) {
  try {
    const result = await taskService.getTasks(req.query, req.user);

    res.json({
      success: true,
      data: result.tasks,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
}

// Get Single Task
async function getTaskById(req, res, next) {
  try {
    const task = await taskService.getTaskById(
      req.params.id,
      req.user
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        error: { message: "Task not found" }
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
}

// Update Task
async function updateTask(req, res, next) {
  try {
    const task = await taskService.updateTask(
      req.params.id,
      req.body,
      req.user
    );

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
}

// Delete Task
async function deleteTask(req, res, next) {
  try {
    const task = await taskService.deleteTask(
      req.params.id,
      req.user
    );

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
}

// Get Task Statistics
async function getStats(req, res, next) {
  try {
    const stats = await taskService.getTaskStats(req.user);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getStats
};
