const userService = require("../services/userService");

// Create User
async function createUser(req, res, next) {
  try {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
}

// Get All Users
async function getUsers(req, res, next) {
  try {
    const users = await userService.getUsers();

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUser,
  getUsers
};