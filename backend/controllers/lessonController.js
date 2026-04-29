const Lesson = require("../models/Lesson");
const asyncHandler = require("../middleware/asyncHandler");
const Level = require("../models/Level");


const createLesson = asyncHandler(async (req, res) => {

  const level = await Level.findById(req.body.levelId);

if(!level){
   res.status(404);
   throw new Error("Level not found");

 
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

  const levelId = req.params.levelId;

  const level = await Level.findById(levelId);

  const progress = await Progress.findOne({
    user: req.user._id,
    course: level.course
  });

  const levelProgress = progress?.levelsProgress?.find(lp =>
    lp.level.toString() === levelId
  );

  // 🔥 BLOCK ACCESS
  // if (!levelProgress && level.order !== 1) {
  //   return res.status(403).json({
  //     message: "Level locked. Complete previous level."
  //   });
  // }
  if (!levelProgress && level.order !== 1) {
  res.status(403);
  throw new Error("Level locked. Complete previous level");
}


  const lessons = await Lesson.find({ level: levelId }).sort({ order: 1 });

  res.json({
    success: true,
    data: lessons
  });

});
 
const adminGetLessons = async (req, res) => {
  const lessons = await Lesson.find().populate("course");
  res.json(lessons);
};

const adminDeleteLesson = async (req, res) => {
  await Lesson.findByIdAndDelete(req.params.id);
  res.json({ message: "Lesson deleted" });
};

module.exports = {createLesson,
                  getLessonsByLevel, 
                  adminGetLessons,
                  adminDeleteLesson
}