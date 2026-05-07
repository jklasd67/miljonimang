const express = require("express");

const {
  generateQuestionSet,
  generateHint,
  generateAudiencePoll,
} = require("../services/question-service");
const { loadTaskDetails } = require("../services/task-service");

const router = express.Router();

router.post("/questions", async (req, res) => {
  try {
    const { taskId } = req.body;
    if (!taskId) {
      return res.status(400).json({ error: "taskId on kohustuslik" });
    }

    const task = await loadTaskDetails(taskId);
    const questions = await generateQuestionSet(task);
    return res.json({ questions });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({ error: error.message });
  }
});

router.post("/hint", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "question on kohustuslik" });
    }

    const hint = await generateHint(question);
    return res.json({ hint });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/audience", (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "question on kohustuslik" });
    }

    const poll = generateAudiencePoll(question);
    return res.json({ poll });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
