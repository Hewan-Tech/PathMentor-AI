//handle all backend errors in one place.
const errorHandler = (err, req, res, next) => {

  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error"
  });

};

module.exports = errorHandler;
