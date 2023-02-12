module.exports = (res, statusCode, data) => {
  res.status(statusCode).json({
    success: statusCode < 400,
    data,
  });
};