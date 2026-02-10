const express=require("express");
const router=express.Router();
const { guard, authorize }= require("../middleware/authMiddleware");

router.get("/dashboard", guard, authorize("admin"), (req,res)=>{
    res.json({
        message: "Welcome Admin",
        admin: req.user.name
    });
});

module.exports=router;