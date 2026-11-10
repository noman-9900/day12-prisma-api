require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  databaseUrl: process.env.DATABASE_URL,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d"
};


const path = require("path");
const dotenv = require("dotenv");

const envFile =
  process.env.NODE_ENV === "test"
    ? ".env.test"
    : ".env";

dotenv.config({
  path: path.resolve(process.cwd(), envFile)
});