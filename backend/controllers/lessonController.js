const Lesson = require("../models/Lesson");
const asyncHandler = require("../middleware/asyncHandler");
const Level = require("../models/Level");


const createLesson = asyncHandler(async (req, res) => {

  const level = await Level.findById(req.body.levelId);

if(!level){
  return res.status(404).json({
    message: "Level not found"
  });
}

  const lesson = await Lesson.create({
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    videoUrl: req.body.videoUrl,
    order: req.body.order,
    level: req.body.levelId,
    course: req.body.courseId,
    createdBy: req.user._id
  });

  res.status(201).json({
    success: true,
    data: lesson
  });

});

const getLessonsByLevel = asyncHandler(async (req, res) => {

  const lessons = await Lesson.find({
    level: req.params.levelId
  }).sort({ order: 1 });

  res.json({
    success: true,
    data: lessons
  });

});

module.exports = {createLesson, getLessonsByLevel}