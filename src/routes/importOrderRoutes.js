const express = require("express");
const {
  createImportOrder,
  getAllImportOrders,
} = require("../controllers/importOrderController");

const router = express.Router();

router.post("/", createImportOrder);

router.get("/", getAllImportOrders);

module.exports = router;
