const Employee = require("../models/Employees");
const cloudinary = require("cloudinary").v2;
// Lấy danh sách tất cả nhân viên
exports.getAllEmployees = async (req, res) => {
  try {
    console.log("getAllEmployees");
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi lấy danh sách nhân viên.", error });
  }
};

// Lấy thông tin chi tiết của một nhân viên
exports.getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Nhân viên không tồn tại." });
    }
    res.status(200).json(employee);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi lấy thông tin nhân viên.", error });
  }
};

// Tạo mới một nhân viên
exports.createEmployee = async (req, res) => {
  try {
    // Log yêu cầu để kiểm tra
    console.log("🚀 ~ exports.createEmployee= ~ req:", req.body);

    // Giải nén thông tin từ req.body
    const { employeeId, name, address, phone, monthlySalary, status, image } =
      req.body;

    // Kiểm tra xem hình ảnh có được gửi lên không
    if (!image) {
      return res.status(400).send("Không có hình ảnh được tải lên.");
    }

    // Upload image từ Base64 lên Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      upload_preset: "agrifly",
    });

    // Tạo đối tượng mới với thông tin nhân viên
    const newEmployee = {
      employeeId,
      name,
      address,
      phone,
      monthlySalary,
      status,
      image: result.secure_url, // Lưu đường dẫn đến hình ảnh trả về từ Cloudinary
    };
    console.log("🚀 ~ exports.createEmployee= ~ newEmployee:", newEmployee);

    // Lưu nhân viên vào cơ sở dữ liệu
    const employeeModel = new Employee(newEmployee); // thay Employee bằng model của bạn
    await employeeModel.save();

    // Trả về phản hồi thành công
    return res.status(201).json(employeeModel);
  } catch (error) {
    // Log lỗi và trả về phản hồi lỗi
    console.error("Error saving new employee:", error);
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi tạo nhân viên.",
      error: error.message, // gửi thông báo lỗi chi tiết hơn
    });
  }
};
// Cập nhật thông tin nhân viên
exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Nhân viên không tồn tại." });
    }
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Đã xảy ra lỗi khi cập nhật nhân viên.", error });
  }
};
// Cập nhật trạng thái của một nhân viên
exports.updateStatusEmployee = async (req, res) => {
  const { id } = req.params; // Lấy ID của nhân viên từ params
  const { status } = req.body; // Lấy trạng thái mới từ body

  try {
    // Tìm và cập nhật trạng thái của nhân viên
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { status }, // Chỉ cập nhật trường `status`
      { new: true, runValidators: true } // Trả về document đã cập nhật và kiểm tra giá trị hợp lệ
    );

    // Kiểm tra nếu nhân viên không tồn tại
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Nhân viên không tồn tại." });
    }

    res.status(200).json({
      message: "Cập nhật trạng thái thành công.",
      employee: updatedEmployee,
    });
  } catch (error) {
    res.status(400).json({
      message: "Đã xảy ra lỗi khi cập nhật trạng thái.",
      error: error.message,
    });
  }
};

// Xóa một nhân viên
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  console.log("🚀 ~ exports.deleteEmployee ~ id:", id);
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Nhân viên không tồn tại." });
    }
    // await deletedEmployee.save();
    res.status(200).json(deletedEmployee);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi xóa nhân viên.", error });
  }
};
