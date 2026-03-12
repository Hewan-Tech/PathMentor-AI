const Level = require("../models/Level");
const asyncHandler = require("../middleware/asyncHandler");

exports.getLevelsByTrack = asyncHandler(async (req, res) => {

  const levels = await Level.find({
    course: req.params.courseId
  }).sort({ order: 1 });

  res.json({
    success: true,
    data: levels
  });

});
