const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const OrderRentalStatsRoutes = require("./routes/orderRentalStatsRoutes");
const cloudinaryRoutes = require("./routes/cloudinaryRoutes");
const userRoutes = require("./routes/userRoutes");
const importOrderRoutes = require("./routes/importOrderRoutes");
const session = require("express-session");

const app = express();

// Kết nối đến MongoDB
connectDB();
app.use(bodyParser.json({ limit: "10mb" }));
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH "], // Allowed methods
    // allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // If you need credentials (cookies, auth headers, etc.)
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 giờ
  })
);
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return res.status(200).end();
  }
  next();
});

app.use(express.json());
app.use(passport.initialize());

// Định nghĩa các routes
app.use("/api/payment", paymentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/importorder", importOrderRoutes);
app.use("/api/rental", rentalRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/orderrentalstats", OrderRentalStatsRoutes);
app.use("/uploads", cloudinaryRoutes);
// Export app để server.js sử dụng
module.exports = app;
