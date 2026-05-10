const express = require("express");
const router = express.Router();
const { guard, authorize } = require("../middleware/authMiddleware");
const {
  sendMessage,
  getMessagesByRoom,
  deleteMessage,
  adminGetConversations,
} = require("../controllers/messageController");

router.post("/", guard, sendMessage);
router.get("/admin/conversations", guard, authorize("admin"), adminGetConversations);
router.get("/:roomId", guard, getMessagesByRoom);
router.delete("/:id", guard, deleteMessage);

module.exports = router;
