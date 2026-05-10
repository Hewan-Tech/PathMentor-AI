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

const adminGetLessons = asyncHandler(async (req, res) => {
  const { courseId, levelId, page = 1, limit = 10 } = req.query;
  const query = {};
  if (courseId) query.course = courseId;
  if (levelId) query.level = levelId;
  const total = await Lesson.countDocuments(query);
  const lessons = await Lesson.find(query)
    .populate("level", "title order")
    .populate("createdBy", "name email")
    .sort({ order: 1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json({ success: true, total, data: lessons });
});

const adminDeleteLesson = asyncHandler(async (req, res) => {
  await Lesson.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Lesson deleted" });
});

const adminUpdateLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: lesson });
});

module.exports = { createLesson, getLessonsByLevel, adminGetLessons, adminDeleteLesson, adminUpdateLesson };