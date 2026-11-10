const { z } = require("zod");

const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(100),

  description: z.string().optional(),

  status: z.enum([
    "TODO",
    "IN_PROGRESS",
    "DONE"
  ]).optional(),

  projectId: z.coerce.number().int().positive()
});

module.exports = {
  createTaskSchema
};