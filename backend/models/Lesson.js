const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

    level: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Level"
    },
      order: {
    type: Number
  },
    content: String,

    videoUrl: String,

    images: [String],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);