const Session = require("../models/Session");
const asyncHandler = require("../middleware/asyncHandler");

// POST /api/sessions - student books a session
const bookSession = asyncHandler(async (req, res) => {
  const { mentorId, date, meetingLink } = req.body;
  const session = await Session.create({
    studentId: req.user._id,
    mentorId,
    date,
    meetingLink,
    status: "scheduled",
  });
  res.status(201).json({ success: true, data: session });
});

// GET /api/sessions/my - get sessions for logged-in user (student or mentor)
const getMySessions = asyncHandler(async (req, res) => {
  const query =
    req.user.role === "mentor"
      ? { mentorId: req.user._id }
      : { studentId: req.user._id };
  const sessions = await Session.find(query)
    .populate("studentId", "name email")
    .populate("mentorId", "name email")
    .sort({ date: -1 });
  res.json({ success: true, data: sessions });
});

// GET /api/sessions/:id - get single session
const getSessionById = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id)
    .populate("studentId", "name email")
    .populate("mentorId", "name email");
  if (!session) {
    res.status(404);
    throw new Error("Session not found");
  }
  res.json({ success: true, data: session });
});

// PUT /api/sessions/:id/status - mentor updates session status
const updateSessionStatus = asyncHandler(async (req, res) => {
  const { status, summary, feedback } = req.body;
  const session = await Session.findById(req.params.id);
  if (!session) {
    res.status(404);
    throw new Error("Session not found");
  }
  if (status) session.status = status;
  if (summary) session.summary = summary;
  if (feedback) session.feedback = feedback;
  await session.save();
  res.json({ success: true, data: session });
});

// DELETE /api/sessions/:id - cancel session
const cancelSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) {
    res.status(404);
    throw new Error("Session not found");
  }
  session.status = "cancelled";
  await session.save();
  res.json({ success: true, message: "Session cancelled" });
});

// GET /api/sessions/admin/all - admin views all sessions
const adminGetAllSessions = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const query = status ? { status } : {};
  const total = await Session.countDocuments(query);
  const sessions = await Session.find(query)
    .populate("studentId", "name email")
    .populate("mentorId", "name email")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json({ success: true, total, data: sessions });
});

module.exports = {
  bookSession,
  getMySessions,
  getSessionById,
  updateSessionStatus,
  cancelSession,
  adminGetAllSessions,
};
