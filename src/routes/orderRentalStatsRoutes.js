const express = require("express");
const {
  saveOrderRentalStats,
  getOrderRentalStats,
  updateOrderRentalStats,
  getAllOrderRentalStats,
} = require("../controllers/orderRentalStatsController");

const router = express.Router();

// Route để lưu thống kê đơn hàng và đơn thuê theo tuần hoặc tháng
router.post("/", saveOrderRentalStats);

// Route để lấy thống kê theo tuần hoặc tháng
router.get("/:month/:week/:year", getOrderRentalStats);

router.get("/", getAllOrderRentalStats);

router.put("/", updateOrderRentalStats);

module.exports = router;
