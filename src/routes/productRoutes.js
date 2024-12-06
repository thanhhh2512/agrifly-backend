const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");
const Rental = require("../models/Rental");
// Lấy tất cả sản phẩm
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Thêm sản phẩm mới
router.post("/", async (req, res) => {
  const product = new Product(req.body);
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lấy sản phẩm theo ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cập nhật sản phẩm
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log("🚀 ~ router.put ~ product:", product);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Tăng số lượt thuê của sản phẩm
router.patch("/rent/:id", async (req, res) => {
  try {
    const { quantity } = req.body; // Lấy số lượng thuê từ request body

    if (!quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.rental += quantity; // Tăng số lượt thuê theo quantity
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.patch("/:id", async (req, res) => {
  try {
    const { quantity } = req.body; // Lấy số lượng thuê từ request body

    if (!quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.quantity += quantity;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Xử lý mua sản phẩm
router.patch("/purchase/:id", async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res
      .status(400)
      .json({ message: "Amount must be a positive number" });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Kiểm tra số lượng hàng còn đủ không
    if (product.quantity < amount) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Tăng purchases và giảm quantity
    product.purchases += amount;
    product.quantity -= amount;

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cập nhật khi xóa đơn thuê
router.patch("/reduceRental/:id", async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res
      .status(400)
      .json({ message: "Amount must be a positive number" });
  }
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.rental > 0) {
      product.rental -= amount;
      await product.save();
      res.json({ message: "Rental count decreased", product });
    } else {
      res.status(400).json({ message: "No rentals to remove" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cập nhật khi xóa đơn mua
router.patch("/reducePurchase/:id", async (req, res) => {
  const { amount } = req.body; // Số lượng sản phẩm cần giảm
  if (!amount || amount <= 0) {
    return res
      .status(400)
      .json({ message: "Amount must be a positive number" });
  }
  console.log("ReduceProduct");
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Kiểm tra nếu purchases >= amount
    if (product.purchases >= amount) {
      product.purchases -= amount;
      product.quantity += amount;
      await product.save();
      res.json({ message: "Purchase count decreased", product });
    } else {
      res.status(400).json({ message: "Invalid amount to reduce" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Thêm đánh giá cho sản phẩm
router.post("/reviews/:id", async (req, res) => {
  const { content, stars, orderId, rentalOrderId, reviewer } = req.body;
  console.log("🚀 ~ router.post ~ req.body:", req.body);

  try {
    // Kiểm tra nếu cả hai orderId và rentalOrderId đều không có giá trị
    if (!orderId && !rentalOrderId) {
      return res
        .status(400)
        .json({ message: "Either Order ID or Rental Order ID is required" });
    }

    let order;
    let rentalOrder;

    // Kiểm tra nếu có orderId thì xác thực đơn hàng
    if (orderId) {
      order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      if (order.status !== "Đã giao hàng") {
        return res
          .status(400)
          .json({ message: "Order must be completed to review" });
      }
    }

    // Kiểm tra nếu có rentalOrderId thì xác thực đơn thuê
    if (rentalOrderId) {
      rentalOrder = await Rental.findById(rentalOrderId);
      if (!rentalOrder) {
        return res.status(404).json({ message: "Rental order not found" });
      }
      if (rentalOrder.status !== "Đã kết thúc thuê") {
        return res
          .status(400)
          .json({ message: "Rental order must be completed to review" });
      }
    }

    // Tìm sản phẩm cần thêm đánh giá
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Kiểm tra nếu người dùng đã đánh giá sản phẩm này trong đơn hàng hoặc đơn thuê hiện tại
    const existingReview = product.reviews.find(
      (review) =>
        (review.orderId && review.orderId.toString() === orderId) ||
        (review.rentalOrderId &&
          review.rentalOrderId.toString() === rentalOrderId)
    );
    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this product from this order",
      });
    }

    // Thêm đánh giá mới vào mảng reviews của sản phẩm
    const newReview = {
      content,
      stars,
      reviewer: reviewer,
      orderId: orderId || null,
      rentalOrderId: rentalOrderId || null,
      isReviewed: true,
    };
    console.log("🚀 ~ router.post ~ newReview:", newReview);

    product.reviews.push(newReview);
    await product.save(); // Lưu thay đổi vào cơ sở dữ liệu

    res.status(201).json({ message: "Review added successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Lấy danh sách đánh giá của sản phẩm
router.get("/reviews/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "reviews.reviewer",
      "name email"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product.reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Xóa sản phẩm
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
