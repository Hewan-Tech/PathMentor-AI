const express =require ('express');
const router =express.Router();
const upload = require("../middleware/uploadMiddleware"); 
const {registerUser, loginUser} = require("../controllers/authController");

router.post("/register", upload.single("certificate"), registerUser);
router.post("/login", loginUser);


module.exports= router;