// const express = require("express");
// const router = express.Router();
// const { guard, authorize } = require("../middleware/authMiddleware");
// const User = require("../models/User");



// // controllers (USE YOUR EXISTING ONES)
// const userCtrl = require("../controllers/userController");
// const courseCtrl = require("../controllers/courseController");
// const lessonCtrl = require("../controllers/lessonController");
// const quizCtrl = require("../controllers/quizController");
// const progressCtrl = require("../controllers/progressController");
// const announcementCtrl = require("../controllers/announcementController");

// /* ================= ADMIN DASHBOARD STATS ================= */

// router.get("/dashboard", guard, authorize("admin"), async (req, res) => {
//   try {
//     const verifiedMentors = await User.countDocuments({
//       role: "mentor",
//       "mentorVerification.status": "approved",
//     });

//     const pendingMentors = await User.countDocuments({
//       role: "mentor",
//       "mentorVerification.status": "pending",
//     });

//     const rejectedMentors = await User.countDocuments({
//       role: "mentor",
//       "mentorVerification.status": "rejected",
//     });

//     const totalStudents = await User.countDocuments({
//       role: "student",
//     });
//     const totalMentors= await User.countDocuments({
//       role: "mentor"
//     });

//     res.status(200).json({
//       verifiedMentors,
//       pendingMentors,
//       rejectedMentors,
//       totalStudents,
//       totalMentors,
//     });
//   } catch (error) {
//     console.error("Admin dashboard error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// router.get( "/pending-mentors",guard, authorize("admin"), async (req, res) => {
//     try {
//       const mentors = await User.find({
//         role: "mentor",
//         "mentorVerification.status": "pending",
//       })
//         .select(
//           "name email mentorVerification createdAt"
//         )
//         .sort({ createdAt: -1 });

//       res.status(200).json({
//         success: true,
//         count: mentors.length,
//         mentors,
//       });
//     } catch (error) {
//       console.error("Fetch pending mentors error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Server error",
//       });
//     }
//   }
// );

// /* ================= APPROVE MENTOR ================= */

// router.put("/mentor/:id/approve", guard, authorize("admin"), async (req, res) => {
//   try {
//     const mentor = await User.findById(req.params.id);

//     if (!mentor || mentor.role !== "mentor") {
//       return res.status(404).json({ message: "Mentor not found" });
//     }

//     mentor.mentorVerification.status = "approved";
//     mentor.mentorVerification.reviewdBy = req.user._id;
//     mentor.mentorVerification.reviewedAt = new Date();

//     await mentor.save();

//     res.status(200).json({ message: "Mentor approved successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /* ================= REJECT MENTOR ================= */

// router.put("/mentor/:id/reject", guard, authorize("admin"), async (req, res) => {
//   try {
//     const mentor = await User.findById(req.params.id);

//     if (!mentor || mentor.role !== "mentor") {
//       return res.status(404).json({ message: "Mentor not found" });
//     }

//     mentor.mentorVerification.status = "rejected";
//     mentor.mentorVerification.reviewdBy = req.user._id;
//     mentor.mentorVerification.reviewedAt = new Date();

//     await mentor.save();

//     res.status(200).json({ message: "Mentor rejected successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;
 const express = require("express");
const router = express.Router();

const { guard, authorize } = require("../middleware/authMiddleware");
const User = require("../models/User");

// controllers (USE YOUR EXISTING ONES)
const userCtrl = require("../controllers/userController");
const courseCtrl = require("../controllers/courseController");
const lessonCtrl = require("../controllers/lessonController");
const quizCtrl = require("../controllers/quizController");
const progressCtrl = require("../controllers/progressController");
const leaderboardCtrl = require("../controllers/leaderboardController");
const announcementCtrl = require("../controllers/announcementController");
const activityCtrl = require("../controllers/admin/activityController");
const studentController = require("../controllers/studentController");
// ADMIN ONLY
router.use(guard, authorize("admin"));

/* ================= DASHBOARD ================= */
router.get("/dashboard", userCtrl.getDashboardStats);

/* ================= USERS ================= */
router.get("/users", userCtrl.getAllUsers);
router.delete("/user/:id", userCtrl.deleteUser);
router.put("/user/:id/role", userCtrl.updateUserRole);

/* ================= MENTORS ================= */
router.get("/mentors", userCtrl.getAllMentors);
router.get("/pending-mentors", userCtrl.getPendingMentors);
router.post("/mentor", userCtrl.createMentor);
router.put("/mentor/:id/approve", userCtrl.approveMentor);
router.put("/mentor/:id/reject", userCtrl.rejectMentor);

/* ================= COURSES ================= */
router.get("/courses", courseCtrl.adminGetCourses);
router.delete("/course/:id", courseCtrl.adminDeleteCourse);
router.put("/course/:id", courseCtrl.adminUpdateCourse);

/* ================= LESSONS ================= */
router.get("/lessons", lessonCtrl.adminGetLessons);
router.delete("/lesson/:id", lessonCtrl.adminDeleteLesson);

/* ================= QUIZZES ================= */
router.get("/quizzes", quizCtrl.adminGetQuizzes);
router.delete("/quiz/:id", quizCtrl.adminDeleteQuiz);

/* ================= ANALYTICS ================= */
router.get("/analytics", progressCtrl.getPlatformAnalytics);

/* ================= LEADERBOARD ================= */
router.get("/leaderboard", leaderboardCtrl.getLeaderboard);

/* ================= ANNOUNCEMENTS ================= */
router.post("/announcement", announcementCtrl.createAnnouncement);
router.delete("/announcement/:id", announcementCtrl.deleteAnnouncement);
router.get("/announcements", announcementCtrl.getAnnouncements);

// 🔍 SEARCH MENTORS
router.get("/search-mentors", userCtrl.searchMentors);



// recent (dashboard)
router.get("/activities", activityCtrl.getRecentActivities);

// view all
router.get("/activities/all", activityCtrl.getAllActivities);


// student routes
router.get("/students", studentController.getStudents);
router.post("/students", studentController.createStudent);
router.get("/students/:id", studentController.getStudentById);
router.put("/students/:id", studentController.updateStudent);
router.delete("/students/:id", studentController.deleteStudent);
router.patch("/students/:id/status", studentController.updateStatus);

module.exports = router;