require("dotenv").config();

const app = require("./app");
const prisma = require("./config/prisma");

const PORT = process.env.PORT || 3000;

let server;


process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);

  gracefulShutdown("UNHANDLED_REJECTION");
});



async function startServer() {
  try {
    await prisma.$connect();

    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    await prisma.$disconnect();
    process.exitCode = 1;
  }
}


let isShuttingDown = false;
async function gracefulShutdown(signal) {
  console.log(`${signal} received. Shutting down...`);

  if (server) {
    server.close(async () => {
      console.log("HTTP server closed.");

      try {
        await prisma.$disconnect();
        console.log("Database disconnected.");
        process.exitCode = 0;
      } catch (error) {
        console.error("Database disconnect failed:", error);
        process.exitCode = 1;
      }
    });
  } else {
    await prisma.$disconnect();
    process.exitCode = 0;
  }
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

startServer();