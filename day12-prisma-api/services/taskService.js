
const prisma = require("../config/prisma");

// Helper: Create HTTP errors
function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

// Helper: Check whether user can manage a task
function canManageTask(task, user) {
  return (
    user.role === "ADMIN" ||
    task.createdById === user.id
  );
}

// Helper: Check project access
async function canAccessProject(projectId, user) {
  // First check whether project exists
  const project = await prisma.project.findUnique({
    where: {
      id: Number(projectId)
    },
    select: {
      id: true,
      ownerId: true,
      members: {
        where: {
          userId: user.id
        },
        select: {
          userId: true
        }
      }
    }
  });

  if (!project) {
    throw createError("Project not found", 404);
  }

  // ADMIN can access any existing project
  if (user.role === "ADMIN") {
    return true;
  }

  return (
    project.ownerId === user.id ||
    project.members.length > 0
  );
}

// Helper: Check task view permission
async function canViewTask(task, user) {
  if (user.role === "ADMIN") {
    return true;
  }

  if (task.createdById === user.id) {
    return true;
  }

  if (task.project.ownerId === user.id) {
    return true;
  }

  const membership = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId: task.projectId,
        userId: user.id
      }
    }
  });

  return Boolean(membership);
}

// Create Task
async function createTask(data, user) {
  const hasAccess = await canAccessProject(
    data.projectId,
    user
  );

  if (!hasAccess) {
    throw createError(
      "You do not have permission to create tasks in this project",
      403
    );
  }

  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      projectId: Number(data.projectId),
      createdById: user.id,

      ...(data.status && {
        status: data.status
      }),

      ...(data.assigneeIds && {
        assignees: {
          connect: data.assigneeIds.map(id => ({
            id: Number(id)
          }))
        }
      })
    }
  });
}

// Get All Tasks
async function getTasks(query = {}, user) {
  const page = Math.max(Number(query.page) || 1, 1);

  const limit = Math.min(
    Math.max(Number(query.limit) || 5, 1),
    100
  );

  const where = {
    ...(query.status && {
      status: query.status
    }),

    ...(query.projectId && {
      projectId: Number(query.projectId)
    }),

    ...(user.role !== "ADMIN" && {
      OR: [
        {
          createdById: user.id
        },
        {
          project: {
            is: {
              ownerId: user.id
            }
          }
        },
        {
          project: {
            is: {
              members: {
                some: {
                  userId: user.id
                }
              }
            }
          }
        }
      ]
    })
  };

  const [tasks, total] = await prisma.$transaction([
    prisma.task.findMany({
      where,

      include: {
        project: true,

        assignees: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },

      orderBy: {
        createdAt: "desc"
      },

      skip: (page - 1) * limit,
      take: limit
    }),

    prisma.task.count({
      where
    })
  ]);

  return {
    tasks,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

// Get Single Task
async function getTaskById(id, user) {
  const task = await prisma.task.findUnique({
    where: {
      id: Number(id)
    },

    include: {
      project: true,
      assignees: true
    }
  });

  if (!task) {
    return null;
  }

  const allowed = await canViewTask(task, user);

  if (!allowed) {
    throw createError(
      "You do not have permission to view this task",
      403
    );
  }

  return task;
}

// Update Task
async function updateTask(id, data, user) {
  const task = await prisma.task.findUnique({
    where: {
      id: Number(id)
    }
  });

  if (!task) {
    throw createError("Task not found", 404);
  }

  if (!canManageTask(task, user)) {
    throw createError(
      "You cannot update another user's task",
      403
    );
  }

  // Check access if task is moved to another project
  if (data.projectId !== undefined) {
    const hasAccess = await canAccessProject(
      data.projectId,
      user
    );

    if (!hasAccess) {
      throw createError(
        "You cannot move this task to that project",
        403
      );
    }
  }

  return prisma.task.update({
    where: {
      id: Number(id)
    },

    data: {
      ...(data.title !== undefined && {
        title: data.title
      }),

      ...(data.description !== undefined && {
        description: data.description
      }),

      ...(data.status !== undefined && {
        status: data.status
      }),

      ...(data.projectId !== undefined && {
        projectId: Number(data.projectId)
      })
    }
  });
}

// Delete Task
async function deleteTask(id, user) {
  const task = await prisma.task.findUnique({
    where: {
      id: Number(id)
    }
  });

  if (!task) {
    throw createError("Task not found", 404);
  }

  if (!canManageTask(task, user)) {
    throw createError(
      "You cannot delete another user's task",
      403
    );
  }

  return prisma.task.delete({
    where: {
      id: Number(id)
    }
  });
}

// Get Task Statistics
async function getTaskStats(user) {
  const where =
    user.role === "ADMIN"
      ? {}
      : {
          OR: [
            {
              createdById: user.id
            },
            {
              project: {
                is: {
                  ownerId: user.id
                }
              }
            },
            {
              project: {
                is: {
                  members: {
                    some: {
                      userId: user.id
                    }
                  }
                }
              }
            }
          ]
        };

  return prisma.task.groupBy({
    by: ["status"],

    where,

    _count: {
      id: true
    }
  });
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats
};
