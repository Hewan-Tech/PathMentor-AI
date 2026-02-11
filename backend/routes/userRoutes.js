const express=require("express");
const router=express.Router();
const { guard }= require("../middleware/authMiddleware");
const { getMyProfile, updateMyProfile,  changePassword, completeProfile }= require("../controllers/userController");

router.get("/profile", guard, getMyProfile );
router.put("/profile", guard, updateMyProfile);
router.put("/change-password", guard, changePassword);
router.post("/onboarding", guard, completeProfile);

module.exports= router;