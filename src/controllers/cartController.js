const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Nếu giỏ hàng đã tồn tại
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (itemIndex > -1) {
        // Nếu sản phẩm đã có trong giỏ, cập nhật số lượng
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Nếu sản phẩm chưa có, thêm mới vào giỏ hàng
        cart.items.push({ productId, quantity });
      }
    } else {
      // Nếu giỏ hàng chưa tồn tại, tạo giỏ hàng mới
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    }

    await cart.save();
    res.status(200).json(cart);
    console.log("cart", cart); // Trả về giỏ hàng đã cập nhật
  } catch (error) {
    console.error("Error adding to cart:", error); // Ghi lại lỗi để kiểm tra
    res.status(500).json({ message: "Error adding to cart", error });
  }
};
exports.removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart)
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });

    // Xóa sản phẩm khỏi giỏ hàng
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    await cart.save();

    res
      .status(200)
      .json({ message: "Xóa sản phẩm khỏi giỏ hàng thành công", cart });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Controller cập nhật số lượng sản phẩm trong giỏ hàng
exports.updateCartItem = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    console.log("🚀 ~ exports.updateCartItem= ~ cart:", cart);
    if (!cart)
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });

    // Tìm và cập nhật số lượng sản phẩm
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1)
      return res
        .status(404)
        .json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res
      .status(200)
      .json({ message: "Cập nhật số lượng sản phẩm thành công", cart });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
exports.getCart = async (req, res) => {
  const { userId } = req.params; // Lấy userId từ URL

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    res.status(200).json(cart); // Trả về giỏ hàng nếu tìm thấy
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
