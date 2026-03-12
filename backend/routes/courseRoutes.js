const express = require("express");
const router = express.Router();

const { createCourse, getCourseRoadmap } = require("../controllers/courseController");


const { guard, authorize } = require("../middleware/authMiddleware");

// create course
router.post("/", guard, authorize("mentor","admin"), createCourse);
router.get("/:id/roadmap", getCourseRoadmap);

module.exports = router;