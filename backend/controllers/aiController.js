const User = require("../models/User");
const Progress = require("../models/Progress");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const asyncHandler = require("../middleware/asyncHandler");

// GET /api/ai/skill-gap - analyze skill gaps based on learning profile vs progress
const analyzeSkillGap = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { skillTrack, experienceLevel, strengths } = user.learningProfile || {};

  if (!skillTrack) {
    res.status(400);
    throw new Error("Complete your learning profile first");
  }

  const progresses = await Progress.find({ user: req.user._id }).populate("course");

  const completedLevels = [];
  let totalXP = 0;

  progresses.forEach((p) => {
    totalXP += p.xpEarned;
    p.levelsProgress.forEach((lp) => {
      if (lp.isCompleted) completedLevels.push(lp.level.toString());
    });
  });

  const levelOrder = ["Awareness", "Beginner", "Fundamental", "Intermediate", "Advanced", "Proficient", "Mastery"];
  const currentIndex = levelOrder.indexOf(experienceLevel) || 0;
  const gaps = levelOrder.slice(0, currentIndex).filter((_, i) => !completedLevels[i]);

  res.json({
    success: true,
    data: {
      skillTrack,
      currentLevel: experienceLevel,
      strengths: strengths || [],
      totalXP,
      completedLevelsCount: completedLevels.length,
      identifiedGaps: gaps.length ? gaps : ["No gaps detected — keep progressing!"],
      recommendation: gaps.length
        ? `Focus on: ${gaps.join(", ")} to strengthen your foundation`
        : "You are on track. Push to the next level!",
    },
  });
});

// GET /api/ai/learning-path - recommend learning path based on profile
const recommendLearningPath = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { skillTrack, experienceLevel, learningGoal, commitmentTime, recommendation } = user.learningProfile || {};

  if (!skillTrack) {
    res.status(400);
    throw new Error("Complete your learning profile first");
  }

  // Find matching courses
  const courses = await Course.find({
    category: new RegExp(skillTrack, "i"),
  }).limit(5);

  const levelOrder = ["Awareness", "Beginner", "Fundamental", "Intermediate", "Advanced", "Proficient", "Mastery"];
  const startIndex = Math.max(levelOrder.indexOf(experienceLevel), 0);
  const suggestedLevels = levelOrder.slice(startIndex, startIndex + 3);

  res.json({
    success: true,
    data: {
      skillTrack,
      currentLevel: experienceLevel,
      learningGoal,
      commitmentTime,
      aiRecommendation: recommendation || `Start with ${suggestedLevels[0]} and progress through ${suggestedLevels.join(" → ")}`,
      suggestedLevels,
      suggestedCourses: courses.map((c) => ({ id: c._id, title: c.title, category: c.category })),
      nextStep: suggestedLevels[0] || "Mastery",
    },
  });
});

// GET /api/ai/summarize/:courseId - summarize what student has learned in a course
const summarizeLearnedContent = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const progress = await Progress.findOne({
    user: req.user._id,
    course: courseId,
  }).populate("course");

  if (!progress) {
    res.status(404);
    throw new Error("No progress found for this course");
  }

  const completedLessonIds = progress.levelsProgress.flatMap((lp) => lp.completedLessons);
  const completedLessons = await Lesson.find({ _id: { $in: completedLessonIds } }).select("title description level");

  const totalLessons = await Lesson.countDocuments({ course: courseId });
  const completedLevels = progress.levelsProgress.filter((lp) => lp.isCompleted);
  const progressPct = totalLessons ? Math.round((completedLessonIds.length / totalLessons) * 100) : 0;

  res.json({
    success: true,
    data: {
      course: progress.course?.title,
      progressPercentage: progressPct,
      xpEarned: progress.xpEarned,
      completedLessonsCount: completedLessonIds.length,
      totalLessons,
      completedLevelsCount: completedLevels.length,
      lessonsCompleted: completedLessons.map((l) => ({ title: l.title, description: l.description })),
      summary: `You have completed ${progressPct}% of this course, earning ${progress.xpEarned} XP across ${completedLevels.length} level(s). ${completedLessonIds.length} out of ${totalLessons} lessons done.`,
    },
  });
});

// GET /api/ai/suggest-next - suggest next course based on current progress
const suggestNextCourse = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { skillTrack, experienceLevel } = user.learningProfile || {};

  const enrolledProgresses = await Progress.find({ user: req.user._id }).select("course");
  const enrolledCourseIds = enrolledProgresses.map((p) => p.course.toString());

  const nextCourses = await Course.find({
    _id: { $nin: enrolledCourseIds },
    category: new RegExp(skillTrack, "i"),
  }).limit(3);

  res.json({
    success: true,
    data: {
      currentTrack: skillTrack,
      currentLevel: experienceLevel,
      suggestedCourses: nextCourses.map((c) => ({ id: c._id, title: c.title, category: c.category })),
      message: nextCourses.length
        ? "Here are your next recommended courses"
        : "You have explored all available courses in your track. Check back soon!",
    },
  });
});

// GET /api/ai/key-concepts/:courseId - review key concepts from completed lessons
const reviewKeyConcepts = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const progress = await Progress.findOne({ user: req.user._id, course: courseId });
  if (!progress) {
    res.status(404);
    throw new Error("No progress found for this course");
  }

  const completedLessonIds = progress.levelsProgress.flatMap((lp) => lp.completedLessons);
  const lessons = await Lesson.find({ _id: { $in: completedLessonIds } }).select("title content description");

  res.json({
    success: true,
    data: {
      courseId,
      keyConcepts: lessons.map((l) => ({
        lesson: l.title,
        concept: l.description || l.content?.slice(0, 200) || "No summary available",
      })),
    },
  });
});

// GET /api/ai/progress-report - generate full AI progress report for student
const generateProgressReport = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const progresses = await Progress.find({ user: req.user._id }).populate("course");

  let totalXP = 0;
  let totalCompleted = 0;
  let totalLevelsCompleted = 0;
  const courseReports = [];

  for (const p of progresses) {
    const totalLessons = await Lesson.countDocuments({ course: p.course?._id });
    const completedCount = p.levelsProgress.reduce((acc, lp) => acc + lp.completedLessons.length, 0);
    const levelsCompleted = p.levelsProgress.filter((lp) => lp.isCompleted).length;

    totalXP += p.xpEarned;
    totalCompleted += completedCount;
    totalLevelsCompleted += levelsCompleted;

    courseReports.push({
      course: p.course?.title,
      xpEarned: p.xpEarned,
      lessonsCompleted: completedCount,
      totalLessons,
      levelsCompleted,
      progressPercentage: totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0,
    });
  }

  res.json({
    success: true,
    data: {
      student: user.name,
      skillTrack: user.learningProfile?.skillTrack,
      currentLevel: user.learningProfile?.experienceLevel,
      totalXP,
      totalCoursesEnrolled: progresses.length,
      totalLessonsCompleted: totalCompleted,
      totalLevelsCompleted,
      courseReports,
      generatedAt: new Date().toISOString(),
    },
  });
});

module.exports = {
  analyzeSkillGap,
  recommendLearningPath,
  summarizeLearnedContent,
  suggestNextCourse,
  reviewKeyConcepts,
  generateProgressReport,
};
