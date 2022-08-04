const ApiError = require("../error/errorClass");

exports.errorHandler = (error, req, res, next) => {
  if (error instanceof ApiError) {
    return res
      .status(error.statusCode)
      .json({ message: error.message, error: error.error });
  }
  return res
    .status(500)
    .json({ message: "Something went wrong", error: error });
};

exports.pageNotFound = async (req, res, next) => {
  const err = new Error(`Page Not found`);
  return next(ApiError.error(404, "No page found", err.message));
};
