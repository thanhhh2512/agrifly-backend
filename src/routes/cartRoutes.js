const express = require("express");
const {
  addToCart,
  removeFromCart,
  updateCartItem,
  getCart,
} = require("../controllers/cartController");

const router = express.Router();

router.post("/addToCart", addToCart);
router.delete("/remove", removeFromCart);
router.put("/update", updateCartItem);
router.get("/:userId", getCart);
module.exports = router;
