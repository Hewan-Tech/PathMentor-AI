const express = require("express");
const router = express.Router();
const { guard, authorize } = require("../middleware/authMiddleware");

const {
  completeLesson,
  updateLevelScore,
  getCourseProgress,
  getUserXP,
  getUserAchievements,
  getUserStreak
} = require("../controllers/progressController");

router.post("/lesson/:id/complete", guard, authorize("student"), completeLesson);
router.post("/level/score", guard, authorize("student"), updateLevelScore);
router.get("/course/:courseId", guard, getCourseProgress);
router.get("/xp", guard, getUserXP);
router.get("/achievements", guard, getUserAchievements);
router.get("/streak", guard, getUserStreak);

module.exports = router;
