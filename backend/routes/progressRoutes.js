const express = require("express");
const router = express.Router();

const {
  completeLesson,
  getCourseProgress,
  getUserXP
} = require("../controllers/progressController");

const { guard } = require("../middleware/authMiddleware");

router.post("/lesson/:id/complete", guard, authorize("student"), completeLesson);

router.get("/course/:courseId", guard, getCourseProgress);

router.get("/xp", guard, getUserXP);

module.exports = router;
