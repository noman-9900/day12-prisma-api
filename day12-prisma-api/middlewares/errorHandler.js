function errorHandler(err, req, res, next) {

  // Prisma duplicate value error
  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "Duplicate value"
    });
  }

  // Prisma record not found error
  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Record not found"
    });
  }

  // Other errors
  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
}

module.exports = errorHandler;