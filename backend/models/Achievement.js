const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },

    completed: {
      type: Boolean,
      default: false,
    },

    score: Number,

    xpEarned: {
      type: Number,
      default: 0,
    },

    completedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);