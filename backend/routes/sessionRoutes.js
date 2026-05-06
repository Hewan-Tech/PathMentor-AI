const express = require("express");
const router = express.Router();
const { guard, authorize } = require("../middleware/authMiddleware");
const { bookSession, getMySessions, getMentorSessions, cancelSession, completeSession, rateSession, getAvailableMentors } = require("../controllers/sessionController");

router.get("/mentors", guard, getAvailableMentors);
router.post("/book", guard, authorize("student"), bookSession);
router.get("/my", guard, authorize("student"), getMySessions);
router.put("/:id/cancel", guard, cancelSession);
router.put("/:id/rate", guard, authorize("student"), rateSession);
router.get("/mentor", guard, authorize("mentor"), getMentorSessions);
router.put("/:id/complete", guard, authorize("mentor"), completeSession);

module.exports = router;
