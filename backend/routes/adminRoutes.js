const express=require("express");
const router=express.Router();
const { guard, authorize }= require("../middleware/authMiddleware");
const User= require("../models/User");


router.get("/dashboard", guard, authorize("admin"), (req,res)=>{
    res.json({
        message: "Welcome Admin",
        admin: req.user.name
    });
});

// approve mentor
router.put("/mentor/:id/approve", guard, authorize("admin"), async(req,res)=>{
    const mentor= await User.findById(req.params.id);

    mentor.mentorVerification.status= "approved";
    mentor.mentorVerification.reviewdBy= req.user._id;
    mentor.mentorVerification.reviewedAt= new Date();

    await mentor.save();

    res.json({
        message: "Mentor approved successfully"
    });
});

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