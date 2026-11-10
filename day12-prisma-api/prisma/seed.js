
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // 1. Create or find user
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

  // 2. Find or create project
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

  // 3. Sample tasks
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

  // 4. Create tasks only if they do not exist
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
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
