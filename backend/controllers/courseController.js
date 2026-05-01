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


module.exports = { createCourse, 
                  getCourseRoadmap,
                  adminGetCourses,
                  adminDeleteCourse,
                  adminUpdateCourse


 };