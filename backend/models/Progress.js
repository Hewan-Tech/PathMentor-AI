const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  completedLessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson"
  }],

  xpEarned: {
    type: Number,
    default: 0
  },

  currentLevel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Level"
  },

  score: {
    type: Number,
    default: 0
  },

  completedAt: Date

},
{ timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);
