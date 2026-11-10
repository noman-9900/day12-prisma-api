const prisma = require("../config/prisma");

async function createProject(data, user) {
  return prisma.project.create({
    data: {
      name: data.name,
      ownerId: user.id
    }
  });
}

async function getProjects(user) {
  return prisma.project.findMany({
    where: user.role === "ADMIN"
      ? {}
      : {
          OR: [
            { ownerId: user.id },
            { members: { some: { userId: user.id } } }
          ]
        },
    include: {
      owner: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

module.exports = { createProject, getProjects };
