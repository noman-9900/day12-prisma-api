const express = require("express");
const router = express.Router();

const protect = require("../middlewares/protect");
const projectController = require("../controllers/projectController");

router.use(protect);
router.post("/", projectController.createProject);
router.get("/", projectController.getProjects);

module.exports = router;
