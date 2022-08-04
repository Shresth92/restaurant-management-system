class ApiError {
  constructor(statusCode, message, error) {
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
  }

  static error(statusCode, message, error) {
    return new ApiError(statusCode, message, error);
  }
}

module.exports = ApiError;
