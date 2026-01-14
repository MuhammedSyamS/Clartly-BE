// middleware/errorMiddleware.js
const errorMiddleware = (err, req, res, next) => {
  console.error("Global error:", err);

  const statusCode = err.statusCode || 500; // default 500
  const message = err.message || "Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorMiddleware;
