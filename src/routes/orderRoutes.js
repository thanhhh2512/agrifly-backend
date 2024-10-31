const express = require("express");
const {
  createOrder,
  getOrders,
  getOrderById,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/createOrder", createOrder);
router.get("/:userId", getOrders);
router.get("/detail/:orderId", getOrderById);

module.exports = router;
