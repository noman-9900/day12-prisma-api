const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");
const protect = require("../middlewares/protect");
const restrictTo = require("../middlewares/restrictTo");

// All task routes require a logged-in user.
router.use(protect);

router.get("/", taskController.getTasks);
router.get("/stats", taskController.getStats);
router.get("/:id", taskController.getTaskById);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

// Explicit admin-only endpoint; service also allows admins to delete any task.
router.delete("/admin/:id", restrictTo("ADMIN"), taskController.deleteTask);

module.exports = router;
