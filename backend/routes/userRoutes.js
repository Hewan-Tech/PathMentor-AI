const express = require("express");
const router  = express.Router();
const { guard } = require("../middleware/authMiddleware");
const upload  = require("../middleware/uploadMiddleware");
const { getMyProfile, updateMyProfile, changePassword, completeProfile } = require("../controllers/userController");
const User = require("../models/User");

router.get("/profile",         guard, getMyProfile);
router.put("/profile",         guard, updateMyProfile);
router.put("/change-password", guard, changePassword);
router.post("/onboarding",     guard, upload.array("documents", 5), completeProfile);

// GET assigned mentor for the logged-in student
router.get("/my-mentor", guard, async (req, res) => {
  try {
    const student = await User.findById(req.user._id).populate(
      "assignedMentor",
      "name email learningProfile.skillTrack learningProfile.experienceLevel studentCount"
    );

    if (!student.assignedMentor) {
      return res.json({ success: true, mentor: null });
    }

    // Get mentor's avg rating
    const Session = require("../models/Session");
    const ratingAgg = await Session.aggregate([
      { $match: { mentorId: student.assignedMentor._id, studentRating: { $gt: 0 } } },
      { $group: { _id: null, avg: { $avg: "$studentRating" }, count: { $sum: 1 } } }
    ]);
    const avgRating = ratingAgg[0]?.avg ? Math.round(ratingAgg[0].avg * 10) / 10 : null;
    const reviewCount = ratingAgg[0]?.count || 0;

    res.json({
      success: true,
      mentor: {
        _id: student.assignedMentor._id,
        name: student.assignedMentor.name,
        email: student.assignedMentor.email,
        skillTrack: student.assignedMentor.learningProfile?.skillTrack || "—",
        studentCount: student.assignedMentor.studentCount || 0,
        avgRating,
        reviewCount
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
