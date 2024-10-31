const Order = require("../models/Order");
const Cart = require("../models/Cart");

exports.createOrder = async (req, res) => {
  const { userId } = req.body;
  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) return res.status(400).json({ message: "Cart not found" });

    // Tính tổng số tiền đơn hàng
    const totalAmount = cart.items.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );

    const order = new Order({
      userId,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      })),
      totalAmount,
    });

    await order.save();
    await Cart.findOneAndDelete({ userId }); // Xóa giỏ hàng sau khi tạo đơn hàng
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
};
exports.getOrders = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ userId });
    if (!orders)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    res
      .status(200)
      .json({ message: "Lấy danh sách đơn hàng thành công", orders });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Controller lấy chi tiết đơn hàng theo ID
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
