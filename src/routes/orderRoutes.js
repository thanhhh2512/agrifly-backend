const express = require("express");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getAllOrders,
  updateEvaluation,
  updateReviewStatus,
} = require("../controllers/orderController");

const router = express.Router();

router.get("/", getAllOrders);
router.post("/", createOrder);
router.get("/:userId", getOrders);
router.get("/detail/:orderId", getOrderById);
router.put("/update/:orderId", updateOrderStatus);
router.put("/evaluate/:id", updateEvaluation);
router.put("/review/:id", updateReviewStatus);
router.delete("/delete/:orderId", deleteOrder);

module.exports = router;
