const errorMiddleware = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  if (process.env.NODE_ENV !== 'production') {
    console.error(error);
  }

  res.status(statusCode).json({
    message: error.isOperational ? error.message : 'Something went wrong',
    detail: process.env.NODE_ENV === 'production' ? undefined : error.message
  });
};

module.exports = errorMiddleware;
