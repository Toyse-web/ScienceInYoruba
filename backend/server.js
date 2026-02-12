import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import articleRoutes from "./routes/articles.js";
import topicRoutes from "./routes/topics.js";
import adminRoutes from "./routes/admin.js"

import { connectDB } from "./config/database.js";

const app = express();

connectDB();

app.use(cors({
    origin: process.env.NODE_ENV === "production"
        ? ["https://scienceinyoruba.org"]
        : ["http://localhost:5173", "http://localhost:300"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Basic route for health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Science in Yoruba API is running",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        version: "1.0.0"
    });
});

// API Routes (I'll create these next)
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/topics", topicRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

// 404 handler
app.use("/api/{*splat}", (req, res) => {
    res.status(404).json({
        success: false,
        error: `API endpoint ${req.originalUrl} not found`
    });
});

// Error handling for middleware
app.use((err, req, res, next) => {
    console.error(`Server Error: ${err}`);

    res.status(err.status || 500).json({
        success: false,
        error: err.message || "Internal server error",
        ...(process.env.NODE_ENV === "developement" && {stack: err.stack})
    });
});

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`
        Science in Yoruba Backend Server
        Server running on port: ${PORT}
        Time: ${new Date().toLocaleTimeString()}
        `);
});

// Handle unhandleed promise rejections
process.on("unhandledRejection", (err) => {
    console.error("Unhandled rejection shutting down");
    console.error(err.name, err.message);

    server.close(() => {
        process.exit(1);
    });
});
