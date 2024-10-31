// db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/agrifly", {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");

    // Thêm dữ liệu mẫu
    const SampleSchema = new mongoose.Schema({
      name: String,
      value: Number,
    });
    const SampleModel = mongoose.model("Sample", SampleSchema);

    const sampleDoc = new SampleModel({ name: "Test Document", value: 123 });
    await sampleDoc.save();
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

module.exports = connectDB;
