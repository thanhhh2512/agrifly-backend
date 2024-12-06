const Rental = require("../models/Rental");

// Tạo mới thông tin thuê
exports.createRental = async (req, res) => {
  try {
    const {
      userId,
      areaType,
      areaSize,
      rentType,
      cropType,
      productType,
      includeDriver,
      mixingRequired,
      selectedEmployees,
      totalCost,
      driverCost,
      product,
      infoCustomer,
      rentalDate,
    } = req.body;

    console.log("🚀 ~ exports.createRental= ~ req.body:", req.body);

    // Tạo bản ghi thuê mới
    const newRental = new Rental({
      userId,
      areaType,
      areaSize,
      rentType,
      cropType,
      productType,
      includeDriver: includeDriver || false,
      mixingRequired: mixingRequired || false,
      selectedEmployees,
      totalCost,
      driverCost,
      product: product || [], // Sử dụng mảng `product` thay vì `productId`
      infoCustomer,
      rentalDate,
    });

    const rental = await newRental.save();
    console.log("🚀 ~ exports.createRental= ~ rental:", rental);

    res.status(201).json({
      message: "Tạo thông tin thuê thành công!",
      data: rental,
    });
  } catch (error) {
    console.error("Error creating rental:", error);
    res.status(500).json({
      message: "Lỗi khi tạo thông tin thuê",
      error: error.message,
    });
  }
};

exports.getAllRentals = async (req, res) => {
  try {
    // Truy vấn toàn bộ đơn thuê
    const rentals = await Rental.find().populate("userId", "name email"); // Populate để lấy thông tin người dùng nếu cần
    console.log("🚀 ~ exports.getAllRentals= ~ rentals:");
    res.status(200).json(rentals);
  } catch (error) {
    console.error("Error fetching all rentals:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách tất cả đơn thuê",
      error: error.message,
    });
  }
};
// Lấy tất cả thông tin thuê cho một userId
exports.getRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ userId: req.params.userId }).populate(
      "userId",
      "name email"
    );

    res.status(200).json(rentals);
    console.log("🚀 ~ exports.getRentals= ~ rentals");
  } catch (error) {
    console.error("Error fetching rentals:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách thuê",
      error: error.message,
    });
  }
};
exports.updateStatus = async (req, res) => {
  const { status } = req.body; // Lấy trạng thái từ req.body
  const { id } = req.params; // Lấy id của đơn thuê từ params

  try {
    // Kiểm tra xem trạng thái có hợp lệ không (nếu có các trạng thái cụ thể như 'pending', 'completed', 'canceled')
    const validStatuses = ["pending", "completed", "canceled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Trạng thái không hợp lệ",
      });
    }

    // Cập nhật trạng thái của đơn thuê
    const rental = await Rental.findByIdAndUpdate(
      id,
      { status }, // Cập nhật trạng thái
      { new: true, runValidators: true }
    );

    if (!rental) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đơn thuê để cập nhật trạng thái" });
    }

    res.status(200).json({
      message: "Cập nhật trạng thái đơn thuê thành công",
      data: rental,
    });
  } catch (error) {
    console.error("Error updating rental status:", error);
    res.status(500).json({
      message: "Lỗi khi cập nhật trạng thái đơn thuê",
      error: error.message,
    });
  }
};
// Lấy thông tin thuê theo ID
exports.getRentalById = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id).populate(
      "userId",
      "name email"
    );
    if (!rental) {
      return res.status(404).json({ message: "Không tìm thấy thông tin thuê" });
    }
    res.status(200).json(rental);
  } catch (error) {
    console.error("Error fetching rental by ID:", error);
    res.status(500).json({
      message: "Lỗi khi lấy thông tin thuê",
      error: error.message,
    });
  }
};

// Cập nhật thông tin thuê
exports.updateRental = async (req, res) => {
  try {
    const rental = await Rental.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!rental) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin thuê để cập nhật" });
    }
    res.status(200).json({
      message: "Cập nhật thông tin thuê thành công",
      data: rental,
    });
  } catch (error) {
    console.error("Error updating rental:", error);
    res.status(500).json({
      message: "Lỗi khi cập nhật thông tin thuê",
      error: error.message,
    });
  }
};
exports.updateEvaluation = async (req, res) => {
  const { evaluation } = req.body;
  const { id } = req.params;

  try {
    // Kiểm tra xem đánh giá có hợp lệ không
    if (!evaluation) {
      return res.status(400).json({
        message: "Đánh giá không được để trống",
      });
    }

    // Cập nhật đánh giá của đơn thuê
    const rental = await Rental.findByIdAndUpdate(
      id,
      { evaluation }, // Cập nhật trường evaluation
      { new: true, runValidators: true }
    );

    if (!rental) {
      return res.status(404).json({
        message: "Không tìm thấy thông tin thuê để cập nhật đánh giá",
      });
    }

    res.status(200).json(rental);
  } catch (error) {
    console.error("Error updating rental evaluation:", error);
    res.status(500).json({
      message: "Lỗi khi cập nhật đánh giá",
      error: error.message,
    });
  }
};
// Cập nhật trường isReviewed
exports.updateIsReviewed = async (req, res) => {
  const { isReviewed } = req.body; // Lấy giá trị isReviewed từ req.body
  const { id } = req.params; // Lấy id của đơn thuê từ params

  try {
    // Kiểm tra xem isReviewed có hợp lệ không
    if (typeof isReviewed !== "boolean") {
      return res.status(400).json({
        message: "Giá trị isReviewed phải là boolean (true/false)",
      });
    }

    // Cập nhật trường isReviewed của đơn thuê
    const rental = await Rental.findByIdAndUpdate(
      id,
      { isReviewed }, // Cập nhật trường isReviewed
      { new: true, runValidators: true } // Trả về bản ghi đã cập nhật
    );

    if (!rental) {
      return res.status(404).json({
        message: "Không tìm thấy thông tin thuê để cập nhật isReviewed",
      });
    }

    res.status(200).json(rental);
  } catch (error) {
    console.error("Error updating isReviewed:", error);
    res.status(500).json({
      message: "Lỗi khi cập nhật isReviewed",
      error: error.message,
    });
  }
};

// Xóa thông tin thuê
exports.deleteRental = async (req, res) => {
  try {
    const rental = await Rental.findByIdAndDelete(req.params.id);
    if (!rental) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin thuê để xóa" });
    }
    res.status(200).json({
      message: "Xóa thông tin thuê thành công",
    });
  } catch (error) {
    console.error("Error deleting rental:", error);
    res.status(500).json({
      message: "Lỗi khi xóa thông tin thuê",
      error: error.message,
    });
  }
};
