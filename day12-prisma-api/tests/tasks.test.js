const request = require("supertest");
const app = require("../app");

const prisma = require("../config/prisma");

const loginUser = require("./helpers/auth");

describe("Tasks API", () => {

  test("should create task for authenticated user", async () => {

    const email = "noman@test.com";
    const password = "12345678";

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Noman",
        email,
        password
      });

    const token = await loginUser(email, password);

    // Create a project for this user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    const project = await prisma.project.create({
      data: {
        name: "Testing Project",
        ownerId: user.id
      }
    });

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Learn Integration Testing",
        projectId: project.id
      });

    expect(response.status).toBe(201);

  });

});


test("should return 403 when user updates another user's task", async () => {

  // Register User A
  await request(app)
    .post("/api/auth/register")
    .send({
      name: "User A",
      email: "usera@test.com",
      password: "12345678"
    });

  // Register User B
  await request(app)
    .post("/api/auth/register")
    .send({
      name: "User B",
      email: "userb@test.com",
      password: "12345678"
    });

  // Login both users
  const tokenA = await loginUser("usera@test.com", "12345678");
  const tokenB = await loginUser("userb@test.com", "12345678");

  // Find User B
  const userB = await prisma.user.findUnique({
    where: { email: "userb@test.com" }
  });

  // Create project for User B
  const project = await prisma.project.create({
    data: {
      name: "User B Project",
      ownerId: userB.id
    }
  });

  // Create task for User B
  const task = await prisma.task.create({
    data: {
      title: "User B Task",
      projectId: project.id
    }
  });

  // User A tries to update User B's task
  const response = await request(app)
    .patch(`/api/tasks/${task.id}`)
    .set("Authorization", `Bearer ${tokenA}`)
    .send({
      title: "Unauthorized Update"
    });

  expect(response.status).toBe(403);

});

test("should return 404 when task does not exist", async () => {

  // Register user
  await request(app)
    .post("/api/auth/register")
    .send({
      name: "Noman",
      email: "noman@test.com",
      password: "12345678"
    });

  // Login
  const token = await loginUser(
    "noman@test.com",
    "12345678"
  );

  // Update non-existing task
  const response = await request(app)
    .patch("/api/tasks/999999")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Updated Task"
    });

  expect(response.status).toBe(404);

});

