const request = require("supertest");
const app = require("../app");

describe("Auth API", () => {

  const user = {
    name: "Noman",
    email: "noman@test.com",
    password: "12345678"
  };

  test("should register a new user", async () => {

    const response = await request(app)
      .post("/api/auth/register")
      .send(user);

    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty("success", true);

  });

  test("should login and return JWT token", async () => {

    await request(app)
      .post("/api/auth/register")
      .send(user);

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: user.email,
        password: user.password
      });

    expect(response.status).toBe(200);

    expect(response.body.token).toBeDefined();

    expect(response.body.user).toBeDefined();

    expect(response.body.user.password).toBeUndefined();

  });

  test("should reject wrong password", async () => {

    await request(app)
      .post("/api/auth/register")
      .send(user);

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: user.email,
        password: "wrongpassword"
      });

    expect(response.status).toBe(401);

  });

});