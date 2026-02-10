const express=require("express");
const router=express.Router();
const { guard }= require("../middleware/authMiddleware");

router.get("/profile", guard, (req, res)=>{
    res.json({
        message: "Protected route accessed", 
        user: req.user
    });
});

module.exports= router;