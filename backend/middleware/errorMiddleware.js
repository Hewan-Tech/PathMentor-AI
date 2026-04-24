const errorHandler = (err, req, res, next) => {

  console.error(err); // for debugging

  res.status(res.statusCode !== 200 ? res.statusCode : 500).json({
    success: false,
    message: err.message || "Server Error"
  });

};

module.exports = errorHandler;
