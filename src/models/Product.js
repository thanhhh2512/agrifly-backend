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
});

module.exports = mongoose.model("Product", productSchema);
