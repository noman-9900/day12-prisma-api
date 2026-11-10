# Prisma vs Mongoose — Tasks API v2

## 1. What Was Easier with Prisma?

- Prisma provides a clear schema for models such as User, Project, and Task.
- Relations are defined in the schema, making relationships easier to understand.
- Prisma Client provides autocomplete and type-aware queries.
- CRUD operations use a consistent API, such as `findMany`, `findUnique`, `create`, `update`, and `delete`.
- Filtering, sorting, pagination, and grouping are supported through query options.

## 2. What Was Harder with Prisma?

- PostgreSQL requires a database and connection configuration.
- Schema changes usually require migrations.
- Relations and foreign keys must follow the database schema.
- Invalid relation IDs can cause database constraint errors.
- Prisma error codes, such as P2002 and P2025, must be handled correctly.

## 3. Prisma vs Mongoose

| Feature | Prisma + PostgreSQL | Mongoose + MongoDB |
|---|---|---|
| Database type | Relational SQL | Document database |
| Schema | Prisma schema | Mongoose schemas |
| Relationships | Foreign keys and relations | References or embedded documents |
| Migrations | Built-in Prisma migration workflow | Schema changes are more flexible |
| Queries | Prisma Client | Mongoose model methods |
| Data consistency | Strong relational constraints | Depends on schema and application design |
| Best fit | Structured, related data | Flexible document-based data |

## 4. Which Database Would I Choose?

For this Tasks API, I would choose **PostgreSQL with Prisma**.

The application contains users, projects, and tasks with relationships between them. A task belongs to a project, a project has an owner, and tasks may have assignees. PostgreSQL provides foreign keys and relational constraints to help maintain data consistency.

Prisma also makes database queries easier to read and maintain.

MongoDB with Mongoose would still be a reasonable choice if the application needed highly flexible document structures or frequently changing document formats.

## 5. Conclusion

Both approaches can build the same API. Mongoose can feel more flexible when working with documents, while Prisma offers a structured workflow for relational data. For this application, I prefer Prisma with PostgreSQL because the relationships and data integrity requirements make a relational database a good fit.
