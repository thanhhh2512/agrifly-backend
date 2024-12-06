const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
    trim: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^0\d{9}$/.test(v); // Validate phone number format (Vietnamese phone format)
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Đang được thuê", "Không đang được thuê"],
    default: "Không đang được thuê",
    required: true,
  },
  rentalOrdersThisMonth: {
    type: Number,
    default: 0,
    min: 0,
  },
  monthlySalary: {
    type: Number,
    required: true,
    min: 0,
  },
  experience: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Employee", employeeSchema);
