const Quiz = require("../models/Quiz");
const asyncHandler = require("../middleware/asyncHandler");

const createQuiz = asyncHandler(async (req, res) => {

  const quiz = await Quiz.create({
    lesson: req.body.lessonId,
    questions: req.body.questions
  });

  res.status(201).json({
    success: true,
    data: quiz
  });

});

const getQuizByLesson = asyncHandler(async (req, res) => {

  const quiz = await Quiz.findOne({
    lesson: req.params.lessonId
  });

  res.json({
    success: true,
    data: quiz
  });

});

const adminGetQuizzes = asyncHandler(async (req, res) => {
  const { lessonId, page = 1, limit = 10 } = req.query;
  const query = lessonId ? { lesson: lessonId } : {};
  const total = await Quiz.countDocuments(query);
  const quizzes = await Quiz.find(query)
    .populate("lesson", "title")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json({ success: true, total, data: quizzes });
});

const adminDeleteQuiz = asyncHandler(async (req, res) => {
  await Quiz.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Quiz deleted" });
});

module.exports = { createQuiz, getQuizByLesson, adminGetQuizzes, adminDeleteQuiz };