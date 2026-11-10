const request = require("supertest");
const app = require("../../app");

async function loginUser(email, password) {

  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email,
      password
    });

  return response.body.token;
}

module.exports = loginUser;