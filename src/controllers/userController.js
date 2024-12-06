// controllers/userController.js
const User = require("../models/User");

// Lấy danh sách tất cả tài khoản
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách tài khoản", error });
  }
};

// Lấy thông tin tài khoản theo ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin tài khoản", error });
  }
};

// Xóa tài khoản theo ID
const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy tài khoản để xóa" });
    }
    res.status(200).json({ message: "Xóa tài khoản thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa tài khoản", error });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUserById,
};
