const ImportOrder = require("../models/ImportOrder");

const createImportOrder = async (req, res) => {
  const { supplierName, productId, quantity, importPrice } = req.body;

  try {
    // Kiểm tra đầu vào
    if (
      !supplierName ||
      !productId ||
      !quantity ||
      quantity <= 0 ||
      !importPrice ||
      importPrice <= 0
    ) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Tạo phiếu nhập mới
    const importOrder = await ImportOrder.create({
      supplierName,
      productId,
      quantity,
      importPrice,
    });
    console.log("🚀 ~ createImportOrder ~ importOrder:", importOrder);

    return res.status(201).json(importOrder);
  } catch (error) {
    console.error("Error creating import order:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
const getAllImportOrders = async (req, res) => {
  try {
    const importOrders = await ImportOrder.find()
      .populate("productId", "name image category")
      .sort({ createdAt: -1 });

    return res.status(200).json(importOrders);
  } catch (error) {
    console.error("Error fetching import orders:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
module.exports = { createImportOrder, getAllImportOrders };
