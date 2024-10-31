require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const app = express();

// Kết nối đến MongoDB
connectDB();

// Sử dụng middleware CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Thiết lập các header COOP và COEP
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

app.use(express.json());
app.use(passport.initialize());

// Định nghĩa các routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

// Export app để server.js sử dụng
module.exports = app;
