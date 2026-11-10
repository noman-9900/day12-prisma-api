const getPagination = require("../utils/pagination");

describe("Pagination Helper", () => {

  test("should return default values", () => {
    const result = getPagination();

    expect(result).toEqual({
      page: 1,
      limit: 10,
      skip: 0
    });
  });

  test("should calculate skip correctly", () => {
    const result = getPagination(3, 10);

    expect(result.skip).toBe(20);
  });

  test("should reject invalid page", () => {
    const result = getPagination(-1, 10);

    expect(result.page).toBe(1);
  });

  test("should reject invalid limit", () => {
    const result = getPagination(1, 0);

    expect(result.limit).toBe(10);
  });

  test("should not allow limit above 100", () => {
    const result = getPagination(1, 500);

    expect(result.limit).toBe(100);
  });

});