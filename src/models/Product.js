const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String },
  detailedDescription: { type: String },
  rating: { type: Number, default: 0 },
  price: { type: Number, required: true },
  category: { type: String },
  purchases: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
  maxPayload: { type: Number },
  totalWeight: { type: Number },
  dimensions: { type: String },
  accuracy: { type: String },
  spreadingPayload: { type: Number },
  sprayingPayload: { type: Number },
  coverage: { type: Number },
  sprayingEfficiency: { type: String },
  rental: { type: Number, default: 0 },
  evaluation: { type: String, default: "" },
  reviews: [
    {
      content: { type: String, required: false },
      stars: { type: Number, required: false, min: 1, max: 5 },
      reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
      rentalOrderId: { type: mongoose.Schema.Types.ObjectId, ref: "Rental" },
      isReviewed: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Product", productSchema);
