const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

// Route để tạo mới một transaction
router.post("/", transactionController.createTransaction);

// Route để lấy tất cả transactions của một user
router.get("/user/:userId", transactionController.getTransactionsByUser);

// Route để lấy chi tiết transaction theo ID
router.get("/:id", transactionController.getTransactionById);

module.exports = router;
