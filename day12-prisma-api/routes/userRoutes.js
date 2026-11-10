const express = require("express");
const router = express.Router();

const protect = require("../middlewares/protect");
const restrictTo = require("../middlewares/restrictTo");
const userController = require("../controllers/userController");

router.use(protect);
router.post("/", restrictTo("ADMIN"), userController.createUser);
router.get("/", restrictTo("ADMIN"), userController.getUsers);

module.exports = router;
