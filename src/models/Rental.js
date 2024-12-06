const mongoose = require("mongoose");

const RentalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  areaType: { type: String, required: true },
  areaSize: { type: Number, required: true },
  rentType: { type: String, required: true },
  cropType: { type: String, required: false },
  productType: { type: String, required: false },
  includeDriver: { type: Boolean, default: false },
  mixingRequired: { type: Boolean, default: false },
  totalCost: { type: Number, required: true },
  driverCost: { type: Number, required: false },
  status: { type: String, default: "Chưa thanh toán" },
  selectedEmployees: [
    {
      employeeId: { type: String, required: true },
      name: { type: String, required: true },
      experience: { type: String },
      image: { type: String },
    },
  ],
  infoCustomer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
  },
  rentalDate: { type: Date, required: true },
  product: [
    {
      productId: { type: String, default: null },
      quantity: { type: Number, default: null },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  evaluation: { type: String, default: "" },
  isReviewed: { type: Boolean, default: false },
});

// Tạo và xuất mô hình Rental
module.exports = mongoose.model("Rental", RentalSchema);
