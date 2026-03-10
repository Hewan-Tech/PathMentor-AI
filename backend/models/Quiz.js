const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    track: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      required: true,
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