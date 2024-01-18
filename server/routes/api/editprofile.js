const express = require('express');
const router = express.Router();
const User = require('../../db/user'); // Đảm bảo bạn đã định nghĩa User schema ở đây
const session = require('express-session');
// Lấy thông tin người dùng từ cơ sở dữ liệu
router.get('/', async (req, res) => {
  try {
    // Trích xuất email của người dùng từ yêu cầu
    const { email } = req.query; // Sửa req.body thành req.query để trích xuất email từ query parameters

    // Tìm người dùng dựa trên email
    const user = await User.findOne({ email });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'Không tìm thấy thông tin người dùng.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi.' });
  }
});

router.put('/', async (req, res) => {
  try {
    const { email, fullName, phone } = req.body;

    // Tìm người dùng dựa trên email
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Kiểm tra và ngăn chặn việc cập nhật trường email
    if (email !== existingUser.email) {
      return res.status(400).json({ message: 'Không được phép cập nhật email.' });
    }

    // Cập nhật các trường khác ngoài email
    existingUser.fullName = fullName;
    existingUser.phone = phone;

    // Lưu thông tin người dùng đã cập nhật
    await existingUser.save();

    res.status(200).json({ message: 'Thông tin cá nhân đã được cập nhật.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi.' });
  }
});

module.exports = router;
