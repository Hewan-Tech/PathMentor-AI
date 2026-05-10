const express = require("express");
const router = express.Router();
const { guard, authorize } = require("../middleware/authMiddleware");
const {
  getMyAchievements,
  getUserAchievements,
  adminGetAllAchievements,
} = require("../controllers/achievementController");

router.get("/my", guard, getMyAchievements);
router.get("/admin/all", guard, authorize("admin"), adminGetAllAchievements);
router.get("/user/:userId", guard, authorize("admin"), getUserAchievements);

module.exports = router;
