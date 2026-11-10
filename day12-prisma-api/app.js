
require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

// 1. Helmet - Security Headers
app.use(helmet());

// 2. CORS - Allow-list
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3001"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// 3. Body Size Limits
app.use(express.json({
  limit: "10kb"
}));

app.use(express.urlencoded({
  extended: true,
  limit: "10kb"
}));



app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    environment: process.env.NODE_ENV
  });
});



// 4. API Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// 5. 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: "Route not found"
    }
  });
});

// 6. Global Error Handler
app.use((error, req, res, next) => {
  console.error(error);

  if (error.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      error: {
        message: "Request body is too large"
      }
    });
  }

  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      error: {
        message: "Origin not allowed"
      }
    });
  }

  if (error.code === "P2002") {
    return res.status(409).json({
      success: false,
      error: {
        message: "Record already exists"
      }
    });
  }

  if (error.code === "P2025") {
    return res.status(404).json({
      success: false,
      error: {
        message: "Record not found"
      }
    });
  }

  if (error.code === "P2003") {
    return res.status(400).json({
      success: false,
      error: {
        message: "Invalid related record ID"
      }
    });
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: {
      message:
        statusCode === 500
          ? "Internal server error"
          : error.message
    }
  });
});

// Export Express app for Supertest
module.exports = app;
