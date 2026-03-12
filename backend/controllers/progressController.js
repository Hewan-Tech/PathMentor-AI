const Progress = require("../models/Progress");
const Lesson = require("../models/Lesson");
const Level = require("../models/Level");
const Achievement = require("../models/Achievement");
const asyncHandler = require("../middleware/asyncHandler");



/*
--------------------------------
XP CALCULATION BASED ON LEVEL
--------------------------------
*/

const getXPForLevel = (levelTitle) => {

  const xpMap = {
    Awareness: 5,
    Beginner: 10,
    Fundamental: 15,
    Intermediate: 20,
    Advanced: 30,
    Proficient: 40,
    Mastery: 50
  };

  return xpMap[levelTitle] || 5;

};



/*
--------------------------------
CHECK ACHIEVEMENTS
--------------------------------
*/

const checkAchievements = async (userId, progress) => {

  const completedCount = progress.completedLessons.length;

  // First lesson achievement
  if (completedCount === 1) {

    await Achievement.create({
      user: userId,
      title: "First Step",
      description: "Completed your first lesson"
    });

  }

  // 5 lessons achievement
  if (completedCount === 5) {

    await Achievement.create({
      user: userId,
      title: "Fast Learner",
      description: "Completed 5 lessons"
    });

  }

  // 10 lessons achievement
  if (completedCount === 10) {

    await Achievement.create({
      user: userId,
      title: "Dedicated Learner",
      description: "Completed 10 lessons"
    });

  }

};



/*
--------------------------------
COMPLETE LESSON
--------------------------------
POST /api/progress/lesson/:id/complete
--------------------------------
*/

const completeLesson = asyncHandler(async (req, res) => {

  const userId = req.user._id;
  const lessonId = req.params.id;

  // Find lesson
  const lesson = await Lesson.findById(lessonId);

  if (!lesson) {
    return res.status(404).json({
      success: false,
      message: "Lesson not found"
    });
  }

  // Find level
  const level = await Level.findById(lesson.level);

  if (!level) {
    return res.status(404).json({
      success: false,
      message: "Level not found"
    });
  }

  // XP calculation
  const xp = getXPForLevel(level.title);

  // Find existing progress
  let progress = await Progress.findOne({
    user: userId,
    course: lesson.course
  });

  // If progress doesn't exist create it
  if (!progress) {

    progress = await Progress.create({
      user: userId,
      course: lesson.course,
      completedLessons: [],
      xpEarned: 0,
      score: 0
    });

  }

  // Prevent duplicate completion
  if (progress.completedLessons.includes(lessonId)) {

    return res.json({
      success: true,
      message: "Lesson already completed",
      totalXP: progress.xpEarned
    });

  }

  // Update progress
  progress.completedLessons.push(lessonId);
  progress.xpEarned += xp;
  progress.score += xp;
  progress.currentLevel = level._id;
  progress.completedAt = new Date();

  await progress.save();

  // Check achievements
  await checkAchievements(userId, progress);

  res.json({
    success: true,
    message: "Lesson completed successfully",
    xpEarned: xp,
    totalXP: progress.xpEarned,
    completedLessons: progress.completedLessons.length
  });

});



/*
--------------------------------
GET USER PROGRESS FOR COURSE
--------------------------------
GET /api/progress/course/:courseId
--------------------------------
*/

const getCourseProgress = asyncHandler(async (req, res) => {

  const progress = await Progress.findOne({
    user: req.user._id,
    course: req.params.courseId
  })
  .populate("completedLessons");

  if (!progress) {

    return res.json({
      success: true,
      completedLessons: [],
      xpEarned: 0
    });

  }

  res.json({
    success: true,
    data: progress
  });

});



/*
--------------------------------
GET USER TOTAL XP
--------------------------------
GET /api/progress/xp
--------------------------------
*/

const getUserXP = asyncHandler(async (req, res) => {

  const progresses = await Progress.find({
    user: req.user._id
  });

  let totalXP = 0;

  progresses.forEach(p => {
    totalXP += p.xpEarned;
  });

  res.json({
    success: true,
    totalXP
  });

});



/*
--------------------------------
EXPORT CONTROLLER
--------------------------------
*/

module.exports = {
  completeLesson,
  getCourseProgress,
  getUserXP
};
