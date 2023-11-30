// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    // Log the error
    console.error('An unhandled error occurred:', err);
  
    // Handle specific types of errors
    if (err instanceof CustomError) {
      // Handle custom errors with specific logic
      return res.status(err.statusCode).json({ error: err.message });
    }
  
    // Handle other types of errors
    return res.status(500).json({ error: 'Internal Server Error' });
  };
  
  // Custom Error Class
  class CustomError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  // Example Route Handler
  const exampleRouteHandler = (req, res, next) => {
    try {
      // Some code that may throw an error
      throw new CustomError('Example error message', 400);
    } catch (err) {
      // Pass the error to the error handler middleware
      next(err);
    }
  };
  
  // Register the global error handler middleware
//   app.use(errorHandler);
  
//   // Register the example route handler
//   app.get('/example', exampleRouteHandler);
  module.exports = errorHandler;