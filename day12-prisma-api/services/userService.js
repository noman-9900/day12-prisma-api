const prisma = require("../config/prisma");

async function createUser(data) {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
}

async function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });
}

module.exports = { createUser, getUsers };
