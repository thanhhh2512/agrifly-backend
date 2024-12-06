const Order = require("../models/Order");
const Cart = require("../models/Cart");

exports.createOrder = async (req, res) => {
  const { userId, infoCustomer, rentalDate, notes, items, totalCost } =
    req.body;
  console.log("🚀 ~ exports.createOrder= ~ req.body:", req.body);

  try {
    // Kiểm tra xem có giỏ hàng của người dùng không
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.status(400).json({ message: "Không tìm thấy giỏ hàng" });
    }

    // Tính tổng số tiền của đơn hàng
    const totalAmount = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Tạo mới đơn hàng với thông tin khách hàng và các mặt hàng trong giỏ
    const order = new Order({
      userId,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      infoCustomer,
      rentalDate,
      notes,
      totalAmount,
      totalCost,
    });

    // Lưu đơn hàng vào cơ sở dữ liệu
    await order.save();
    console.log("🚀 ~ exports.createOrder= ~ order:", order);

    // Phản hồi thành công
    res.status(201).json({ message: "Đơn hàng đã được tạo thành công", order });
  } catch (err) {
    console.error("Error creating order:", err);
    res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi tạo đơn hàng", error: err });
  }
};
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find(); // Truy vấn tất cả đơn hàng trong cơ sở dữ liệu
    if (!orders.length) {
      return res.status(404).json({ message: "Không có đơn hàng nào" });
    }
    res
      .status(200)
      .json({ message: "Lấy danh sách tất cả đơn hàng thành công", orders });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tất cả đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Lấy danh sách đơn hàng của người dùng
exports.getOrders = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ userId });
    if (!orders.length)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    res
      .status(200)
      .json({ message: "Lấy danh sách đơn hàng thành công", orders });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
// Cập nhật đánh giá của đơn hàng
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

    const order = await Order.findByIdAndUpdate(
      id,
      { evaluation }, // Cập nhật trường evaluation
      { new: true, runValidators: true }
    );
    console.log("🚀 ~ exports.updateEvaluation= ~ order:", order);

    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy thông tin đơn hàng để cập nhật đánh giá",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order evaluation:", error);
    res.status(500).json({
      message: "Lỗi khi cập nhật đánh giá",
      error: error.message,
    });
  }
};
// Lấy chi tiết đơn hàng theo ID
exports.getOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    res
      .status(200)
      .json({ message: "Lấy chi tiết đơn hàng thành công", order });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Cập nhật thông tin đơn hàng theo ID
// Cập nhật trạng thái của đơn hàng theo ID
exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params; // Lấy orderId từ URL
  const { status } = req.body; // Lấy status từ request body

  try {
    // Cập nhật chỉ trường status của đơn hàng
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // Trả về đối tượng đã cập nhật
    );

    // Nếu không tìm thấy đơn hàng, trả về lỗi 404
    if (!updatedOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Phản hồi đơn hàng đã cập nhật
    res.status(200).json({
      message: "Cập nhật trạng thái đơn hàng thành công",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};
exports.updateReviewStatus = async (req, res) => {
  const { orderId } = req.params; // Lấy ID đơn hàng và sản phẩm từ URL
  const { isReviewed } = req.body; // Lấy trạng thái isReviewed từ body request

  try {
    // Kiểm tra trạng thái isReviewed có hợp lệ hay không
    if (typeof isReviewed !== "boolean") {
      return res
        .status(400)
        .json({ message: "Trạng thái isReviewed không hợp lệ" });
    }

    // Tìm đơn hàng theo orderId
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Cập nhật trạng thái isReviewed
    item.isReviewed = isReviewed;

    // Lưu lại đơn hàng sau khi cập nhật
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái isReviewed:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Xóa đơn hàng theo ID
exports.deleteOrder = async (req, res) => {
  const { id } = req.params; // Lấy ID từ tham số URL

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(204).json(); // Trả về mã trạng thái 204 No Content
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server error" });
  }
};
