const express = require("express");
const router = express.Router();
const { guard, authorize } = require("../middleware/authMiddleware");
const User = require("../models/User");

/* ================= ADMIN DASHBOARD STATS ================= */

router.get("/dashboard", guard, authorize("admin"), async (req, res) => {
  try {
    const verifiedMentors = await User.countDocuments({
      role: "mentor",
      "mentorVerification.status": "approved",
    });

    const pendingMentors = await User.countDocuments({
      role: "mentor",
      "mentorVerification.status": "pending",
    });

    const rejectedMentors = await User.countDocuments({
      role: "mentor",
      "mentorVerification.status": "rejected",
    });

    const totalStudents = await User.countDocuments({
      role: "student",
    });
    const totalMentors= await User.countDocuments({
      role: "mentor"
    });

    res.status(200).json({
      verifiedMentors,
      pendingMentors,
      rejectedMentors,
      totalStudents,
      totalMentors,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get( "/pending-mentors",guard, authorize("admin"), async (req, res) => {
    try {
      const mentors = await User.find({
        role: "mentor",
        "mentorVerification.status": "pending",
      })
        .select(
          "name email mentorVerification createdAt"
        )
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: mentors.length,
        mentors,
      });
    } catch (error) {
      console.error("Fetch pending mentors error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

/* ================= APPROVE MENTOR ================= */

router.put("/mentor/:id/approve", guard, authorize("admin"), async (req, res) => {
  try {
    const mentor = await User.findById(req.params.id);

    if (!mentor || mentor.role !== "mentor") {
      return res.status(404).json({ message: "Mentor not found" });
    }

    mentor.mentorVerification.status = "approved";
    mentor.mentorVerification.reviewdBy = req.user._id;
    mentor.mentorVerification.reviewedAt = new Date();

    await mentor.save();

    res.status(200).json({ message: "Mentor approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= REJECT MENTOR ================= */

router.put("/mentor/:id/reject", guard, authorize("admin"), async (req, res) => {
  try {
    const mentor = await User.findById(req.params.id);

    if (!mentor || mentor.role !== "mentor") {
      return res.status(404).json({ message: "Mentor not found" });
    }

    mentor.mentorVerification.status = "rejected";
    mentor.mentorVerification.reviewdBy = req.user._id;
    mentor.mentorVerification.reviewedAt = new Date();

    await mentor.save();

    res.status(200).json({ message: "Mentor rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
