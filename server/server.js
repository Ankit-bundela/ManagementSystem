
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

// Routes
const employeeRoutes = require("./routes/employeeRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const salaryRoutes = require("./routes/salaryRoutes");
const employeeAddressRoutes = require("./routes/employeeAddressRoutes");
const locationRoutes = require("./routes/locationRoutes");
const inactiveUsersRouter = require("./routes/inactiveUsers");
const authRouter = require("./routes/auth");

// JWT Middleware
const verifyToken = require("./middleware/verifyToken");

// Public APIs
app.use("/auth", authRouter);

// Protected APIs
app.use("/dashboard", verifyToken, dashboardRoutes);
app.use("/departments", verifyToken, departmentRoutes);
app.use("/employees", verifyToken, employeeRoutes);
app.use("/addresses", verifyToken, employeeAddressRoutes);
app.use("/salary", verifyToken, salaryRoutes);
app.use("/attendance", verifyToken, attendanceRoutes);
app.use("/locations", verifyToken, locationRoutes);
app.use("/inactiveUsers", verifyToken, inactiveUsersRouter);

// Start Server
const PORT = process.env.PORT || 5050;
app.get("/", (req, res) => {
    res.send("Employee Management System API is running!");
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Backend is running"
    });
});

app.listen(PORT, () => {
    console.log(`Server is ready on port ${PORT}`);
});