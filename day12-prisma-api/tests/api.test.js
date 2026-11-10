const request = require("supertest");
const app = require("../app");

describe("API Integration Tests", () => {

  test("should return 200 for valid request", async () => {

    const response = await request(app)
      .get("/api/tasks");

    expect(response.status).toBe(200);

  });

});