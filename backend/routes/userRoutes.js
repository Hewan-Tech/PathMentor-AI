const express=require("express");
const router=express.Router();
const { guard }= require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { getMyProfile, updateMyProfile,  changePassword, completeProfile }= require("../controllers/userController");

router.get("/profile", guard, getMyProfile );
router.put("/profile", guard, updateMyProfile);
router.put("/change-password", guard, changePassword);
router.post("/onboarding", guard, upload.array("documents", 5), completeProfile);

module.exports= router;