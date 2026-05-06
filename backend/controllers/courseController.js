const Course= require("../models/Course");
const Level = require("../models/Level");
const asyncHandler = require("../middleware/asyncHandler");
const Lesson = require("../models/Lesson");
const { logActivity } = require("../utils/activityLogger");


const createCourse = asyncHandler(async (req, res)=> {
  const course = new Course ({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    createdBy: req.user._id,
    instructor: req.body.instructorId || undefined,
  });
  await course.save();

  await logActivity({
    user: req.user._id,
    type: "COURSE_CREATED",
    message: `New course "${course.title}" created`
  });

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
});

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

const adminGetCourses = asyncHandler(async (req, res) => {
  const { search, mentorId, category, page = 1, limit = 10 } = req.query;
  const query = {};

  if (search) {
    const searchRegex = new RegExp(search, "i");
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { category: searchRegex }
    ];
  }

  if (mentorId) {
    query.instructor = mentorId;
  }

  if (category) {
    query.category = category;
  }

  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const pageSize = Math.max(parseInt(limit, 10) || 10, 1);

  const total = await Course.countDocuments(query);
  const courses = await Course.find(query)
    .populate("instructor")
    .populate("createdBy")
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  res.json({
    success: true,
    data: courses,
    total,
    page: pageNumber,
    pages: Math.max(Math.ceil(total / pageSize), 1),
  });
});

const adminDeleteCourse = async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Course deleted" });
};

const adminUpdateCourse = async (req, res) => {
  
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(course);
};


// GET /api/courses - Get all available courses for students
const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find()
    .populate("instructor", "name email learningProfile")
    .sort({ createdAt: -1 })
    .lean();

  // Add lesson count for each course
  for (let course of courses) {
    const lessonCount = await Lesson.countDocuments({ course: course._id });
    course.lessonCount = lessonCount;
  }

  res.json({
    success: true,
    data: courses
  });
});

// POST /api/courses/:id/enroll - Enroll student in a course
const enrollInCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const userId = req.user._id;

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  // Update user's learning profile with course info
  const User = require("../models/User");
  await User.findByIdAndUpdate(userId, {
    "learningProfile.course": {
      id: course._id,
      title: course.title
    }
  });

  // Create initial progress record
  const Progress = require("../models/Progress");
  let progress = await Progress.findOne({ user: userId, course: courseId });
  
  if (!progress) {
    progress = await Progress.create({
      user: userId,
      course: courseId,
      levelsProgress: [],
      xpEarned: 0
    });
  }

  await logActivity({
    user: userId,
    type: "COURSE_ENROLLED",
    message: `Student enrolled in "${course.title}"`
  });

  res.json({
    success: true,
    message: "Successfully enrolled in course",
    data: { course, progress }
  });
});

module.exports = { 
  createCourse, 
  getCourseRoadmap,
  adminGetCourses,
  adminDeleteCourse,
  adminUpdateCourse,
  getAllCourses,
  enrollInCourse
};