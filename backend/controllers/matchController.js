const Match = require("../models/Match");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

// POST /api/matches/ai-match - AI matches student to best mentor by track & level
const aiMatchMentor = asyncHandler(async (req, res) => {
  const student = await User.findById(req.user._id);
  const { skillTrack, experienceLevel } = student.learningProfile || {};

  if (!skillTrack || !experienceLevel) {
    res.status(400);
    throw new Error("Complete your learning profile before matching");
  }

  // Find approved mentors
  const mentors = await User.find({
    role: "mentor",
    "mentorVerification.status": "approved",
  }).select("name email learningProfile");

  if (!mentors.length) {
    res.status(404);
    throw new Error("No approved mentors available");
  }

  // Simple match: same skillTrack preference
  const matched =
    mentors.find((m) => m.learningProfile?.skillTrack === skillTrack) ||
    mentors[0];

  // Save match record
  const match = await Match.create({
    student1: req.user._id,
    student2: matched._id,
    track: skillTrack,
    level: experienceLevel,
  });

  res.status(201).json({
    success: true,
    message: "Mentor matched successfully",
    mentor: { id: matched._id, name: matched.name, email: matched.email },
    match,
  });
});

// GET /api/matches/my - get my matches
const getMyMatches = asyncHandler(async (req, res) => {
  const matches = await Match.find({
    $or: [{ student1: req.user._id }, { student2: req.user._id }],
  })
    .populate("student1", "name email")
    .populate("student2", "name email");
  res.json({ success: true, data: matches });
});

// GET /api/matches/admin/all - admin views all matches
const adminGetAllMatches = asyncHandler(async (req, res) => {
  const matches = await Match.find()
    .populate("student1", "name email role")
    .populate("student2", "name email role")
    .sort({ createdAt: -1 });
  res.json({ success: true, data: matches });
});

// DELETE /api/matches/:id - remove a match
const deleteMatch = asyncHandler(async (req, res) => {
  await Match.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Match removed" });
});

module.exports = { aiMatchMentor, getMyMatches, adminGetAllMatches, deleteMatch };
