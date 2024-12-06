const Transaction = require("../models/Transaction");

// Tạo mới một transaction
exports.createTransaction = async (req, res) => {
  try {
    const { userId, orderId, rentalId, type } = req.body;

    // Kiểm tra `type` phải là 'order' hoặc 'rental'
    if (!["order", "rental"].includes(type)) {
      return res.status(400).json({ error: "Loại đơn không hợp lệ" });
    }

    // Tạo transaction mới
    const transaction = new Transaction({ userId, orderId, rentalId, type });
    await transaction.save();

    res
      .status(201)
      .json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Lỗi khi tạo transaction", details: error.message });
  }
};

// Lấy tất cả transactions cho một user
exports.getTransactionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await Transaction.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({
      error: "Lỗi khi lấy danh sách transactions",
      details: error.message,
    });
  }
};

// Lấy chi tiết transaction theo ID
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ error: "Transaction không tồn tại" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({
      error: "Lỗi khi lấy chi tiết transaction",
      details: error.message,
    });
  }
};
