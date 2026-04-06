const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  createAnnouncement,
  getAnnouncements,
  getCourseAnnouncements
} = require("../controllers/announcementController");

const { guard, authorize } = require("../middleware/authMiddleware");

router.post(
  "/",
  guard,
  authorize("admin", "mentor"),

  //  VALIDATION
  body("title").notEmpty().withMessage("Title is required"),
  body("message").notEmpty().withMessage("Message is required"),

  createAnnouncement
);


// Only admin & mentor can create
router.post("/", guard, authorize("admin", "mentor"), createAnnouncement);

// All users can view
router.get("/", guard, getAnnouncements);

// Course-specific announcements
router.get("/course/:courseId", guard, getCourseAnnouncements);

module.exports = router;
