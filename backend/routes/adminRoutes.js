const express=require("express");
const router=express.Router();
const { guard, authorize }= require("../middleware/authMiddleware");
const User= require("../models/User");


// router.get("/dashboard", guard, authorize("admin"), (req,res)=>{
//     res.json({
//         message: "Welcome Admin",
//         admin: req.user.name
//     });
// });
router.get(
  "/dashboard",
  guard,
  authorize("admin"),
  async (req, res) => {
    try {
      const verifiedMentors = await User.countDocuments({
        role: "mentor",
        isApproved: true,
      });

      const pendingMentors = await User.countDocuments({
        role: "mentor",
        isApproved: false,
      });

      const totalStudents = await User.countDocuments({
        role: "student",
      });

      res.json({
        verifiedMentors,
        pendingMentors,
        totalStudents,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ================= GET PENDING MENTORS ================= */

router.get(
  "/pending-mentors",
  guard,
  authorize("admin"),
  async (req, res) => {
    try {
      const mentors = await User.find({
        role: "mentor",
        isApproved: false,
      }).select("-password");

      res.json(mentors);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ================= APPROVE MENTOR ================= */

router.put(
  "/approve-mentor/:id",
  guard,
  authorize("admin"),
  async (req, res) => {
    try {
      const mentor = await User.findById(req.params.id);

      if (!mentor || mentor.role !== "mentor") {
        return res.status(404).json({ message: "Mentor not found" });
      }

       mentor.mentorVerification.status= "approved";
    mentor.mentorVerification.reviewdBy= req.user._id;
    mentor.mentorVerification.reviewedAt= new Date();
      await mentor.save();

      res.json({ message: "Mentor approved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);
// approve mentor
// router.put("/mentor/:id/approve", guard, authorize("admin"), async(req,res)=>{
//     const mentor= await User.findById(req.params.id);

//     mentor.mentorVerification.status= "approved";
//     mentor.mentorVerification.reviewdBy= req.user._id;
//     mentor.mentorVerification.reviewedAt= new Date();

//     await mentor.save();

//     res.json({
//         message: "Mentor approved successfully"
//     });
// });

//reject
router.put("/mentor/:id/reject", guard, authorize("admin"), async(req, res)=>{
    const mentor= await User.findById(req.params.id);

    mentor.mentorVerification.status = "rejected";
    mentor.mentorVerification.reviewdBy = req.user._id;
    mentor.mentorVerification.reviewedAt = new Date();

    await mentor.save();

    res.json({ message: "Mentor rejected" });
}
);

module.exports=router;