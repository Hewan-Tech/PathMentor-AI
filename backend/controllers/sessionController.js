const Session = require("../models/Session");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const { logActivity } = require("../utils/activityLogger");

// POST /api/sessions/book
const bookSession = asyncHandler(async (req, res) => {
  const { mentorId, date } = req.body;
  if (!mentorId || !date) return res.status(400).json({ message: "Mentor ID and date are required" });

  const mentor = await User.findById(mentorId);
  if (!mentor || mentor.role !== "mentor" || mentor.mentorVerification?.status !== "approved") {
    return res.status(404).json({ message: "Approved mentor not found" });
  }

  const sessionDate = new Date(date);
  if (sessionDate < new Date()) return res.status(400).json({ message: "Session date must be in the future" });

  const thirtyMin = 30 * 60 * 1000;
  const conflict = await Session.findOne({
    mentorId,
    status: "scheduled",
    date: { $gte: new Date(sessionDate - thirtyMin), $lte: new Date(sessionDate.getTime() + thirtyMin) }
  });
  if (conflict) return res.status(400).json({ message: "Mentor is not available at that time" });

  const session = await Session.create({ studentId: req.user._id, mentorId, date: sessionDate, status: "scheduled" });

  logActivity({ user: req.user._id, type: "SESSION_BOOKED", message: `${req.user.name} booked a session with ${mentor.name}` }).catch(() => {});

  res.status(201).json({ success: true, data: session });
});

// GET /api/sessions/my
const getMySessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ studentId: req.user._id })
    .populate("mentorId", "name email learningProfile.skillTrack")
    .sort({ date: 1 });
  res.json({ success: true, data: sessions });
});

// GET /api/sessions/mentor
const getMentorSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ mentorId: req.user._id })
    .populate("studentId", "name email learningProfile.skillTrack learningProfile.experienceLevel")
    .sort({ date: 1 });
  res.json({ success: true, data: sessions });
});

// PUT /api/sessions/:id/cancel
const cancelSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) return res.status(404).json({ message: "Session not found" });

  const isOwner = session.studentId.toString() === req.user._id.toString() ||
    session.mentorId.toString() === req.user._id.toString();
  if (!isOwner) return res.status(403).json({ message: "Not authorized" });
  if (session.status !== "scheduled") return res.status(400).json({ message: "Only scheduled sessions can be cancelled" });

  session.status = "cancelled";
  await session.save();
  res.json({ success: true, message: "Session cancelled" });
});

// PUT /api/sessions/:id/complete
const completeSession = asyncHandler(async (req, res) => {
  const { feedback, summary } = req.body;
  const session = await Session.findById(req.params.id);
  if (!session) return res.status(404).json({ message: "Session not found" });

  if (session.mentorId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only the mentor can complete a session" });
  }

  session.status = "completed";
  if (feedback) session.feedback = feedback;
  if (summary) session.summary = summary;
  await session.save();

  logActivity({ user: req.user._id, type: "SESSION_COMPLETED", message: "Session completed by mentor" }).catch(() => {});
  res.json({ success: true, data: session });
});

// PUT /api/sessions/:id/rate
const rateSession = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: "Rating must be between 1 and 5" });

  const session = await Session.findById(req.params.id);
  if (!session) return res.status(404).json({ message: "Session not found" });
  if (session.studentId.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Only the student can rate this session" });
  if (session.status !== "completed") return res.status(400).json({ message: "Can only rate completed sessions" });

  session.studentRating = rating;
  session.studentComment = comment || "";
  await session.save();
  res.json({ success: true, message: "Rating submitted" });
});

// GET /api/sessions/mentors
const getAvailableMentors = asyncHandler(async (req, res) => {
  const mentors = await User.find({ role: "mentor", "mentorVerification.status": "approved" })
    .select("name email learningProfile.skillTrack");
  res.json({ success: true, data: mentors });
});

module.exports = { bookSession, getMySessions, getMentorSessions, cancelSession, completeSession, rateSession, getAvailableMentors };
