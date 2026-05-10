const Message = require("../models/Message");
const asyncHandler = require("../middleware/asyncHandler");

// POST /api/messages - send a message
const sendMessage = asyncHandler(async (req, res) => {
  const { roomId, message } = req.body;
  if (!roomId || !message) {
    res.status(400);
    throw new Error("roomId and message are required");
  }
  const msg = await Message.create({
    sender: req.user._id,
    roomId,
    message,
  });
  const populated = await msg.populate("sender", "name email role");
  res.status(201).json({ success: true, data: populated });
});

// GET /api/messages/:roomId - get all messages in a room
const getMessagesByRoom = asyncHandler(async (req, res) => {
  const messages = await Message.find({ roomId: req.params.roomId })
    .populate("sender", "name email role")
    .sort({ createdAt: 1 });
  res.json({ success: true, data: messages });
});

// DELETE /api/messages/:id - delete a message (sender or admin)
const deleteMessage = asyncHandler(async (req, res) => {
  const msg = await Message.findById(req.params.id);
  if (!msg) {
    res.status(404);
    throw new Error("Message not found");
  }
  const isOwner = msg.sender.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Access denied");
  }
  await msg.deleteOne();
  res.json({ success: true, message: "Message deleted" });
});

// GET /api/messages/admin/conversations - admin views all unique rooms
const adminGetConversations = asyncHandler(async (req, res) => {
  const rooms = await Message.aggregate([
    { $group: { _id: "$roomId", lastMessage: { $last: "$message" }, updatedAt: { $last: "$createdAt" }, count: { $sum: 1 } } },
    { $sort: { updatedAt: -1 } },
  ]);
  res.json({ success: true, data: rooms });
});

module.exports = {
  sendMessage,
  getMessagesByRoom,
  deleteMessage,
  adminGetConversations,
};
