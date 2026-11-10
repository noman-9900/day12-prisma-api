const express = require("express");
const router = express.Router();

const protect = require("../middlewares/protect");
const { authLimiter } = require("../middlewares/authLimiter");
const authController = require("../controllers/authController");

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.get("/me", protect, authController.getMe);

module.exports = router;
