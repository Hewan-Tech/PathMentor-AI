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
  const quizzes = await Quiz.find().populate("course");
  res.json(quizzes);
});

const adminDeleteQuiz = asyncHandler(async (req, res) => {
  await Quiz.findByIdAndDelete(req.params.id);
  res.json({ message: "Quiz deleted" });

});
module.exports = {createQuiz, 
                  getQuizByLesson,
                adminGetQuizzes,
                adminDeleteQuiz
              };