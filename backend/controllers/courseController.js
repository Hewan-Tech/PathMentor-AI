const Course= require("../models/Course");
const Level = require("../models/Level");
const asyncHandler = require("../middleware/asyncHandler");
const Lesson = require("../models/Lesson");

const createCourse = asyncHandler(async (req, res)=> {


    const course = new Course ({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        createdBy: req.user._id
    });
    await course.save();

  const defaultLevels = [
    "Awareness",
    "Beginner",
    "Fundamental",
    "Intermediate",
    "Advanced",
    "Proficient",
    "Mastery"
  ];

     const levelPromises = defaultLevels.map((levelName, index) => {

    return Level.create({
      title: levelName,
      order: index + 1,
      course: course._id
    });

  });

  await Promise.all(levelPromises);

     res.status(201).json({
    success: true,
      message: "Track created with default levels",
    data: course
});
})

const getCourseRoadmap = asyncHandler(async (req, res) => {

  const courseId = req.params.id;

  const levels = await Level.find({
    course: courseId
  })
  .sort({ order: 1 })
  .lean();

  for (let level of levels) {

    level.lessons = await Lesson.find({
      level: level._id
    })
    .sort({ order: 1 });

  }

  res.json({
    success: true,
    levels
  });

});


module.exports = { createCourse, getCourseRoadmap };