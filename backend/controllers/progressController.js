const Progress = require("../models/Progress");
const Lesson = require("../models/Lesson");
const Level = require("../models/Level");
const Achievement = require("../models/Achievement");
const Course = require("../models/Course");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const { createNotification } = require("./notificationController");



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
    const achievement = await Achievement.create({
      user: userId,
      title,
      description
    });

    // Send notification
    await createNotification({
      userId,
      type: "achievement",
      title: "New Achievement Unlocked! 🎉",
      message: `You earned "${title}": ${description}`,
      link: "/achievements",
      icon: "trophy"
    });

    return achievement;
  }

  return null;
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
 const totalLevels = progress.levelsProgress.length;

const completedLevels = progress.levelsProgress.filter(
  lp => lp.isCompleted
).length;

if (totalLevels > 0 && completedLevels === totalLevels) {
  await createAchievementIfNotExists(
    userId,
    "Course Completed",
    "You completed a full course"
  );
}

  // const completedLevels = progress.levelsProgress.filter(lp => lp.isCompleted).length;
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

  const perfectScoreLevel = progress.levelsProgress.find(
  lp => lp.score === 100
);

if (perfectScoreLevel) {
  await createAchievementIfNotExists(
    userId,
    "Perfect Score",
    "Achieved 100% in a level"
  );
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
  res.status(404);
  throw new Error("Lesson not found");
}


  const level = await Level.findById(lesson.level);

  
  if (!level) {
  res.status(404);
  throw new Error("Level not found");
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
  res.status(404);
  throw new Error("Progress not found");
}


  const levelProgress = progress.levelsProgress.find(lp =>
    lp.level.toString() === levelId
  );

 
 if (!levelProgress) {
  res.status(404);
  throw new Error("Level progress not found");
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

const getPlatformAnalytics = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalCourses = await Course.countDocuments();
  res.json({ success: true, totalUsers, totalCourses });
});

/*
========================================
GET USER ACHIEVEMENTS
GET /api/progress/achievements
========================================
*/
const getUserAchievements = asyncHandler(async (req, res) => {
  const achievements = await Achievement.find({ user: req.user._id }).sort({ earnedAt: -1 });
  res.json({ success: true, data: achievements });
});

/*
========================================
GET USER STREAK
GET /api/progress/streak
========================================
*/
const getUserStreak = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("streak");
  res.json({ success: true, streak: user?.streak || { current: 0, longest: 0 } });
});

/*
========================================
DAILY MOTIVATION ENGINE
GET /api/progress/motivation
========================================
*/
const getDailyMotivation = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select("streak");
  const progresses = await Progress.find({ user: userId });

  let totalXP = 0;
  let totalCompletedLessons = 0;
  progresses.forEach(p => {
    totalXP += p.xpEarned;
    p.levelsProgress.forEach(lp => {
      totalCompletedLessons += lp.completedLessons.length;
    });
  });

  const streak = user?.streak?.current || 0;
  const longestStreak = user?.streak?.longest || 0;

  // Generate motivational message
  let message = "Keep learning! You're doing great.";
  let type = "neutral"; // neutral, positive, warning

  if (streak >= 7) {
    message = `🔥 Amazing! ${streak}-day streak! You're on fire!`;
    type = "positive";
  } else if (streak >= 3) {
    message = `Great job! ${streak} days in a row. Keep it up!`;
    type = "positive";
  } else if (streak === 0 && longestStreak > 0) {
    message = `⚠️ Your streak is at risk! Study today to keep your momentum.`;
    type = "warning";
  } else if (totalCompletedLessons >= 10) {
    message = `You've completed ${totalCompletedLessons} lessons! You're making excellent progress.`;
    type = "positive";
  } else if (totalXP >= 100) {
    message = `You've earned ${totalXP} XP! Keep climbing the leaderboard.`;
    type = "positive";
  }

  res.json({
    success: true,
    motivation: {
      message,
      type,
      streak,
      totalXP,
      totalLessons: totalCompletedLessons
    }
  });
});

/*
========================================
WEEKLY GROWTH REPORT
GET /api/progress/weekly-report
========================================
*/
const getWeeklyReport = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Get achievements earned this week
  const weeklyAchievements = await Achievement.find({
    user: userId,
    earnedAt: { $gte: oneWeekAgo }
  });

  // Get all progress to calculate weekly stats
  const progresses = await Progress.find({ user: userId });
  
  let totalXP = 0;
  let totalLessons = 0;
  let completedLevels = 0;

  progresses.forEach(p => {
    totalXP += p.xpEarned;
    p.levelsProgress.forEach(lp => {
      totalLessons += lp.completedLessons.length;
      if (lp.isCompleted) completedLevels++;
    });
  });

  // Estimate hours (rough: 1 lesson = 30 min)
  const estimatedHours = Math.round((totalLessons * 0.5) * 10) / 10;

  // Topics mastered = completed levels
  const topicsMastered = completedLevels;

  res.json({
    success: true,
    report: {
      hoursStudied: estimatedHours,
      topicsMastered,
      xpEarned: totalXP,
      lessonsCompleted: totalLessons,
      achievementsEarned: weeklyAchievements.length,
      weekStart: oneWeekAgo.toISOString(),
      weekEnd: new Date().toISOString()
    }
  });
});

/*
========================================
SMART REMINDER SYSTEM
GET /api/progress/reminder
========================================
*/
const getSmartReminder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select("streak updatedAt");
  
  const streak = user?.streak?.current || 0;
  const lastActivity = user?.updatedAt || new Date();
  const hoursSinceActivity = Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60));

  let reminder = null;

  // Streak at risk
  if (streak > 0 && hoursSinceActivity >= 20) {
    reminder = {
      type: "streak_risk",
      message: `⚠️ Your ${streak}-day streak is at risk! Study today to keep it alive.`,
      urgency: "high"
    };
  }
  // Inactive for 2+ days
  else if (hoursSinceActivity >= 48) {
    reminder = {
      type: "inactive",
      message: "You haven't studied in 2 days. Let's get back on track!",
      urgency: "medium"
    };
  }
  // Inactive for 1 day
  else if (hoursSinceActivity >= 24) {
    reminder = {
      type: "daily_nudge",
      message: "Ready to continue your learning journey today?",
      urgency: "low"
    };
  }

  res.json({
    success: true,
    reminder
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
  getUserXP,
  getPlatformAnalytics,
  getUserAchievements,
  getUserStreak,
  getDailyMotivation,
  getWeeklyReport,
  getSmartReminder
};
