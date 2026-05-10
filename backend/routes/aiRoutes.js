const express = require("express");
const router = express.Router();
const { guard, authorize } = require("../middleware/authMiddleware");
const {
  analyzeSkillGap,
  recommendLearningPath,
  summarizeLearnedContent,
  suggestNextCourse,
  reviewKeyConcepts,
  generateProgressReport,
} = require("../controllers/aiController");

router.get("/skill-gap", guard, authorize("student"), analyzeSkillGap);
router.get("/learning-path", guard, authorize("student"), recommendLearningPath);
router.get("/summarize/:courseId", guard, authorize("student"), summarizeLearnedContent);
router.get("/suggest-next", guard, authorize("student"), suggestNextCourse);
router.get("/key-concepts/:courseId", guard, authorize("student"), reviewKeyConcepts);
router.get("/progress-report", guard, authorize("student"), generateProgressReport);

module.exports = router;
