class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
  
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
      this.isOperational = true;
  
      // Remove console logs and capture stack trace
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;
  