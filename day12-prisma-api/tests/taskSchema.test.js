const { createTaskSchema } =
  require("../validators/taskSchema");

describe("Create Task Schema", () => {

  test("should accept valid task data", () => {
    const data = {
      title: "Learn Jest",
      projectId: 1
    };

    const result = createTaskSchema.safeParse(data);

    expect(result.success).toBe(true);
  });

  test("should reject empty title", () => {
    const data = {
      title: "",
      projectId: 1
    };

    const result = createTaskSchema.safeParse(data);

    expect(result.success).toBe(false);
  });

  test("should reject title longer than 100 characters", () => {
    const data = {
      title: "A".repeat(101),
      projectId: 1
    };

    const result = createTaskSchema.safeParse(data);

    expect(result.success).toBe(false);
  });

  test("should reject invalid status", () => {
    const data = {
      title: "Learn Jest",
      projectId: 1,
      status: "INVALID"
    };

    const result = createTaskSchema.safeParse(data);

    expect(result.success).toBe(false);
  });

  test("should reject negative projectId", () => {
    const data = {
      title: "Learn Jest",
      projectId: -1
    };

    const result = createTaskSchema.safeParse(data);

    expect(result.success).toBe(false);
  });

  test("should accept numeric string projectId", () => {
    const data = {
      title: "Learn Jest",
      projectId: "5"
    };

    const result = createTaskSchema.safeParse(data);

    expect(result.success).toBe(true);
  });

});