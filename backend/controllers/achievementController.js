const Achievement = require("../models/Achievement");
const asyncHandler = require("../middleware/asyncHandler");

// GET /api/achievements/my - get logged-in user achievements
const getMyAchievements = asyncHandler(async (req, res) => {
  const achievements = await Achievement.find({ user: req.user._id }).sort({ earnedAt: -1 });
  res.json({ success: true, data: achievements });
});

// GET /api/achievements/user/:userId - admin views any user's achievements
const getUserAchievements = asyncHandler(async (req, res) => {
  const achievements = await Achievement.find({ user: req.params.userId }).sort({ earnedAt: -1 });
  res.json({ success: true, data: achievements });
});

// GET /api/achievements/admin/all - admin views all achievements
const adminGetAllAchievements = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const total = await Achievement.countDocuments();
  const achievements = await Achievement.find()
    .populate("user", "name email role")
    .sort({ earnedAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json({ success: true, total, data: achievements });
});

module.exports = { getMyAchievements, getUserAchievements, adminGetAllAchievements };
