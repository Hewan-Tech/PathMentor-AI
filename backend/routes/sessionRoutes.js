const express = require("express");
const router = express.Router();
const { guard, authorize } = require("../middleware/authMiddleware");
const {
  bookSession,
  getMySessions,
  getSessionById,
  updateSessionStatus,
  cancelSession,
  adminGetAllSessions,
} = require("../controllers/sessionController");

router.post("/", guard, authorize("student"), bookSession);
router.get("/my", guard, getMySessions);
router.get("/admin/all", guard, authorize("admin"), adminGetAllSessions);
router.get("/:id", guard, getSessionById);
router.put("/:id/status", guard, authorize("mentor", "admin"), updateSessionStatus);
router.put("/:id/cancel", guard, cancelSession);

module.exports = router;
