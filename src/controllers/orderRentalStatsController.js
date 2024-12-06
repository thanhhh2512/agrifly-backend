const OrderRentalStats = require("../models/OrderRentalStats");

// Lưu thống kê đơn hàng và đơn thuê theo tuần hoặc tháng
const saveOrderRentalStats = async (req, res) => {
  const { ordersByDay, rentalsByDay, period, year, week, month } = req.body;

  // Kiểm tra độ dài mảng
  if (ordersByDay.length !== 7 || rentalsByDay.length !== 7) {
    return res.status(400).json({
      message:
        "Mảng ordersByDay và rentalsByDay phải có đúng 7 phần tử cho mỗi ngày trong tuần",
    });
  }

  try {
    const existingData = await OrderRentalStats.findOne({
      year,
      week,
      month,
    });

    if (existingData) {
      return res.status(400).json({
        message: "Dữ liệu cho tuần/tháng này đã tồn tại",
        data: existingData,
      });
    }

    const newOrderRentalStats = new OrderRentalStats({
      period,
      year,
      week,
      month,
      ordersByDay,
      rentalsByDay,
    });

    await newOrderRentalStats.save();
    return res.status(201).json({
      message: "Dữ liệu thống kê đã được lưu thành công",
      data: newOrderRentalStats,
    });
  } catch (error) {
    console.error("Lỗi khi lưu thống kê:", error);
    return res.status(500).json({ message: "Lỗi server", error });
  }
};
// Truy xuất thống kê đơn hàng và đơn thuê theo tuần hoặc tháng
const getOrderRentalStats = async (req, res) => {
  const { month, week, year } = req.params;

  try {
    const data = await OrderRentalStats.findOne({ month, week, year });

    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy dữ liệu thống kê cho tuần/tháng này",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Lỗi khi truy vấn thống kê:", error);
    return res.status(500).json({ message: "Lỗi server", error });
  }
};
const updateOrderRentalStats = async (req, res) => {
  const { ordersByDay, rentalsByDay, month, week, year } = req.body;
  console.log("🚀 ~ updateOrderRentalStats ~ req.body:", req.body);

  try {
    // Kiểm tra xem dữ liệu cho tuần/tháng đó đã tồn tại chưa
    const existingData = await OrderRentalStats.findOne({ month, week, year });
    console.log("🚀 ~ updateOrderRentalStats ~ existingData:", existingData);

    if (!existingData) {
      return res.status(404).json({
        message: "Không tìm thấy dữ liệu thống kê cho tuần/tháng này",
      });
    }

    // Cập nhật dữ liệu thống kê
    existingData.ordersByDay = ordersByDay;
    existingData.rentalsByDay = rentalsByDay;

    await existingData.save();

    return res.status(200).json({
      message: "Dữ liệu thống kê đã được cập nhật thành công",
      data: existingData,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật thống kê:", error);
    return res.status(500).json({ message: "Lỗi server", error });
  }
};
const getAllOrderRentalStats = async (req, res) => {
  try {
    const allData = await OrderRentalStats.find(); // Truy vấn tất cả dữ liệu từ collection

    if (!allData || allData.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy dữ liệu thống kê nào",
      });
    }

    return res.status(200).json(allData);
  } catch (error) {
    console.error("Lỗi khi lấy tất cả dữ liệu thống kê:", error);
    return res.status(500).json({ message: "Lỗi server", error });
  }
};
module.exports = {
  getAllOrderRentalStats,
  saveOrderRentalStats,
  getOrderRentalStats,
  updateOrderRentalStats,
};
