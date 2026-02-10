const express=require("express");
const router=express.Router();
const { guard }= require("../middleware/authMiddleware");
const { getMyProfile, updateMyProfile,  changePassword }= require("../controllers/userController");

router.get("/profile", guard, getMyProfile );
router.put("/profile", guard, updateMyProfile);
router.put("/change-password", guard, changePassword);

module.exports= router;