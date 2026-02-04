import "./init.js";

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import ratelimit, { rateLimit } from 'express-rate-limit';


// Import route files
import authRoutes from "./routes/auth.js";
import vehicleRoutes from "./routes/vehicles.js";
import appointmentRoutes from "./routes/appointments.js";
import inventoryRoutes from "./routes/inventory.js";
import managerRoutes from "./routes/manager.js";
import mechanicRoutes from "./routes/mechanic.js";
import feedbackRoutes from "./routes/feedback.js";
import settingsRoutes from "./routes/settings.js";
import complaintRoutes from "./routes/complaints.js"; // NEW
import reportRoutes from "./routes/reports.js"; // NEW

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Serve static files (for PDF receipts)
app.use(express.static("public"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/mechanic", mechanicRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/complaints", complaintRoutes); // NEW
app.use("/api/reports", reportRoutes); // NEW

// Basic route for testing
app.get("/", (req, res) => {
  res.json({
    message: "Vehicle Service Center API",
    version: "2.1.0",
    status: "Running",
    endpoints: {
      auth: "/api/auth (register, login, me)",
      vehicles: "/api/vehicles",
      appointments: "/api/appointments",
      inventory: "/api/inventory",
      manager: "/api/manager",
      mechanic: "/api/mechanic",
      feedback: "/api/feedback",
      settings: "/api/settings",
      complaints: "/api/complaints", // NEW
      reports: "/api/reports", // NEW
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

if (process.env.JWT_SECRET === undefined) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

if (process.env.MONGO_URI === undefined) {
  console.error("FATAL ERROR: MONGO_URI is not defined.");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`API URL: http://localhost:${PORT}`);
  console.log("=".repeat(50));
});