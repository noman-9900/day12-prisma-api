function getPagination(page = 1, limit = 10) {
  page = Number(page);
  limit = Number(limit);

  if (!Number.isInteger(page) || page < 1) {
    page = 1;
  }

  if (!Number.isInteger(limit) || limit < 1) {
    limit = 10;
  }

  limit = Math.min(limit, 100);

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip
  };
}

module.exports = getPagination;