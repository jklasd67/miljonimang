const express = require("express");

const {
  listTasks,
  loadTaskDetails,
} = require("../services/task-service");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const tasks = await listTasks();
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const task = await loadTaskDetails(req.params.id);
    res.json(task);
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.message });
  }
});

module.exports = router;
