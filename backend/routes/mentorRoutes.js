const express= require("express");
const router= express.Router();
const upload= require("../middleware/uploadMiddleware");
const {guard}= require("../middleware/authMiddleware");
const User= require("../models/User");

// route for upload document
router.post("/upload-documents", guard, upload.array("documents", 5),async(req, res)=>{
    try{
        if(req.user.role!="mentor") {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        const files= req.files.map(file=> file.path);

        req.user.mentorVerification.documents.push(...files);
        req.user.mentorVerification.status = "pending";

        await req.user.save();

        res.status(200).json({
            message: "Documents uploaded successfully. Await admin approval. "
        });
    } catch(error){
        console.error(error);
        res.status(500).json({
            message: "upload failed"
        });
    }
} ); 

router.get( "/dashboard", guard, authorize("mentor"), async (req, res) => {
    try {
      const mentor = await User.findById(req.user.id);

      res.json({
        students: mentor.studentsAssigned,
        pendingReviews: mentor.pendingReviews,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports= router;