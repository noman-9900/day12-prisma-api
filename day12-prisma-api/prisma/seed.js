const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Create or find user
  const user = await prisma.user.upsert({
    where: {
      email: "noman@example.com"
    },
    update: {},
    create: {
      name: "Noman",
      email: "noman@example.com"
    }
  });

  // Create or find project
  let project = await prisma.project.findFirst({
    where: {
      name: "Prisma Practice",
      ownerId: user.id
    }
  });

  if (!project) {
    project = await prisma.project.create({
      data: {
        name: "Prisma Practice",
        ownerId: user.id
      }
    });
  }

  // Sample tasks
  const tasks = [
    {
      title: "Learn Prisma",
      status: "TODO"
    },
    {
      title: "Practice CRUD",
      status: "IN_PROGRESS"
    },
    {
      title: "Complete API",
      status: "DONE"
    }
  ];

  // Create tasks only if they do not exist
  for (const task of tasks) {
    const existingTask = await prisma.task.findFirst({
      where: {
        title: task.title,
        projectId: project.id
      }
    });

    if (!existingTask) {
      await prisma.task.create({
        data: {
          ...task,
          projectId: project.id
        }
      });
    }
  }

  console.log("Seed completed successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });