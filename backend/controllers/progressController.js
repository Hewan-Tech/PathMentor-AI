const Progress = require("../models/Progress");
const Lesson = require("../models/Lesson");
const Level = require("../models/Level");
const Achievement = require("../models/Achievement");
const asyncHandler = require("../middleware/asyncHandler");



/*
========================================
XP CALCULATION
========================================
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
========================================
PREVENT DUPLICATE ACHIEVEMENTS
========================================
*/
const createAchievementIfNotExists = async (userId, title, description) => {

  const exists = await Achievement.findOne({
    user: userId,
    title
  });

  if (!exists) {
    await Achievement.create({
      user: userId,
      title,
      description
    });
  }

};



/*
========================================
CHECK ACHIEVEMENTS
========================================
*/
const checkAchievements = async (userId, progress) => {

  let totalCompletedLessons = 0;

  progress.levelsProgress.forEach(lp => {
    totalCompletedLessons += lp.completedLessons.length;
  });

  const completedLevels = progress.levelsProgress.filter(lp => lp.isCompleted).length;
  const totalXP = progress.xpEarned;

  // 🎯 Achievements

  if (totalCompletedLessons === 1) {
    await createAchievementIfNotExists(userId, "First Step", "Completed your first lesson");
  }

  if (totalCompletedLessons === 5) {
    await createAchievementIfNotExists(userId, "Fast Learner", "Completed 5 lessons");
  }

  if (completedLevels === 1) {
    await createAchievementIfNotExists(userId, "Level Up", "Completed your first level");
  }

  if (completedLevels === 3) {
    await createAchievementIfNotExists(userId, "Level Master", "Completed 3 levels");
  }

  const highScoreLevel = progress.levelsProgress.find(lp => lp.score >= 90);

  if (highScoreLevel) {
    await createAchievementIfNotExists(userId, "High Performer", "Scored 90% or more in a level");
  }

  if (totalXP >= 100) {
    await createAchievementIfNotExists(userId, "XP Starter", "Earned 100 XP");
  }

};



/*
========================================
COMPLETE LESSON
POST /api/progress/lesson/:id/complete
========================================
*/
const completeLesson = asyncHandler(async (req, res) => {

  const userId = req.user._id;
  const lessonId = req.params.id;

  const lesson = await Lesson.findById(lessonId);

  if (!lesson) {
    return res.status(404).json({ message: "Lesson not found" });
  }

  const level = await Level.findById(lesson.level);

  if (!level) {
    return res.status(404).json({ message: "Level not found" });
  }

  const xp = getXPForLevel(level.title);

  let progress = await Progress.findOne({
    user: userId,
    course: lesson.course
  });

  // Create progress if not exists
  if (!progress) {
    progress = await Progress.create({
      user: userId,
      course: lesson.course,
      levelsProgress: [],
      xpEarned: 0
    });
  }

  // Find level progress
  let levelProgress = progress.levelsProgress.find(lp =>
    lp.level.toString() === level._id.toString()
  );

  // Create if not exist
  if (!levelProgress) {
    levelProgress = {
      level: level._id,
      completedLessons: [],
      score: 0,
      isCompleted: false
    };

    progress.levelsProgress.push(levelProgress);
  }

  // Prevent duplicate lesson completion
  if (levelProgress.completedLessons.includes(lessonId)) {
    return res.json({
      success: true,
      message: "Lesson already completed",
      totalXP: progress.xpEarned
    });
  }

  // Add lesson
  levelProgress.completedLessons.push(lessonId);

  // Add XP
  progress.xpEarned += xp;

  await progress.save();

  // Check achievements
  await checkAchievements(userId, progress);

  res.json({
    success: true,
    message: "Lesson completed successfully",
    xpEarned: xp,
    totalXP: progress.xpEarned
  });

});



/*
========================================
UPDATE LEVEL SCORE (QUIZ / PROJECT / EXAM)
POST /api/progress/level/score
========================================
*/
const updateLevelScore = asyncHandler(async (req, res) => {

  const userId = req.user._id;
  const { levelId, score } = req.body;

  const progress = await Progress.findOne({ user: userId });

  if (!progress) {
    return res.status(404).json({ message: "Progress not found" });
  }

  const levelProgress = progress.levelsProgress.find(lp =>
    lp.level.toString() === levelId
  );

  if (!levelProgress) {
    return res.status(404).json({ message: "Level progress not found" });
  }

  // Update score
  levelProgress.score = score;

  const totalLessons = await Lesson.countDocuments({ level: levelId });

  // Unlock condition 🔥
  if (
    levelProgress.completedLessons.length === totalLessons &&
    score >= 80
  ) {
    levelProgress.isCompleted = true;
  }

  await progress.save();

  // Check achievements
  await checkAchievements(userId, progress);

  res.json({
    success: true,
    message: "Score updated",
    levelCompleted: levelProgress.isCompleted
  });

});



/*
========================================
GET COURSE PROGRESS (WITH PERCENTAGE)
GET /api/progress/course/:courseId
========================================
*/
const getCourseProgress = asyncHandler(async (req, res) => {

  const userId = req.user._id;
  const courseId = req.params.courseId;

  const lessons = await Lesson.find({ course: courseId });

  const totalLessons = lessons.length;

  const progress = await Progress.findOne({
    user: userId,
    course: courseId
  });

  let completedLessonsCount = 0;
  let xpEarned = 0;

  if (progress) {
    progress.levelsProgress.forEach(lp => {
      completedLessonsCount += lp.completedLessons.length;
    });

    xpEarned = progress.xpEarned;
  }

  const progressPercentage =
    totalLessons === 0
      ? 0
      : Math.round((completedLessonsCount / totalLessons) * 100);

  res.json({
    success: true,
    totalLessons,
    completedLessons: completedLessonsCount,
    progressPercentage,
    xpEarned
  });

});



/*
========================================
GET USER TOTAL XP
GET /api/progress/xp
========================================
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
========================================
EXPORT
========================================
*/
module.exports = {
  completeLesson,
  updateLevelScore,
  getCourseProgress,
  getUserXP
};
