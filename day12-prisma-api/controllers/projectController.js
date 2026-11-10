const projectService = require("../services/projectService");

async function createProject(req, res, next) {
  try {
    const project = await projectService.createProject(req.body, req.user);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}

async function getProjects(req, res, next) {
  try {
    const projects = await projectService.getProjects(req.user);
    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
}

module.exports = { createProject, getProjects };
