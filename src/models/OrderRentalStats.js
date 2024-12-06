const mongoose = require("mongoose");

// Định nghĩa schema cho thống kê đơn hàng và đơn thuê theo tuần hoặc tháng
const orderRentalStatsSchema = new mongoose.Schema(
  {
    period: { type: String, required: true }, // "week" hoặc "month"
    year: { type: Number, required: true }, // Năm
    ordersByDay: { type: [Number], required: true },
    rentalsByDay: { type: [Number], required: true },
    week: { type: Number, required: true },
    month: { type: Number, required: true },
  },
  { timestamps: true }
);

const OrderRentalStats = mongoose.model(
  "OrderRentalStats",
  orderRentalStatsSchema
);

module.exports = OrderRentalStats;
