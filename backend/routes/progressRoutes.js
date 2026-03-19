const express = require("express");
const router = express.Router();

const {
  completeLesson,
  updateLevelScore,
  getCourseProgress,
  getUserXP
} = require("../controllers/progressController");

const { guard, authorize } = require("../middleware/authMiddleware");

router.post("/lesson/:id/complete", guard, authorize("student"), completeLesson);


router.post("/level/score", guard, authorize("student"), updateLevelScore);

router.get("/course/:courseId", guard, getCourseProgress);

router.get("/xp", guard, getUserXP);

module.exports = router;
