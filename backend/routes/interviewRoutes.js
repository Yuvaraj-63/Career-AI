const express = require("express");

const {
  getInterviewQuestions,
} = require("../controllers/interviewController");

const {
  evaluateInterviewAnswer,
} = require("../controllers/interviewEvaluationController");

const router = express.Router();

// Get randomized interview questions
router.get(
  "/questions",
  getInterviewQuestions
);

// Evaluate user's answer
router.post(
  "/evaluate",
  evaluateInterviewAnswer
);

module.exports = router;