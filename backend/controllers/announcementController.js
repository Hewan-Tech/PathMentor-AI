const Announcement = require("../models/Announcement");
const asyncHandler = require("../middleware/asyncHandler");
const { validationResult } = require("express-validator");


/*
========================================
CREATE ANNOUNCEMENT
========================================
*/
const createAnnouncement = asyncHandler(async (req, res) => {

  // ✅ VALIDATION MUST BE HERE
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const { title, message, course } = req.body;

  const announcement = await Announcement.create({
    title,
    message,
    course,
    createdBy: req.user._id,
    role: req.user.role
  });

  res.status(201).json({
    success: true,
    data: announcement
  });

});



/*
========================================
GET ALL ANNOUNCEMENTS
========================================
*/
const getAnnouncements = asyncHandler(async (req, res) => {

  const announcements = await Announcement.find()
    .populate("createdBy", "name")
    .populate("course", "title")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: announcements
  });

});



/*
========================================
GET ANNOUNCEMENTS BY COURSE
========================================
*/
const getCourseAnnouncements = asyncHandler(async (req, res) => {

  const announcements = await Announcement.find({
    course: req.params.courseId
  })
    .populate("createdBy", "name")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: announcements
  });

});


/*
========================================
DELETE ANNOUNCEMENT
========================================
*/
const deleteAnnouncement = asyncHandler(async (req, res) => {

  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    return res.status(404).json({
      success: false,
      message: "Announcement not found"
    });
  }

  await announcement.remove();

  res.json({
    success: true,
    message: "Announcement deleted successfully"
  });

});

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getCourseAnnouncements,
  deleteAnnouncement
};
