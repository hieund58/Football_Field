const express = require('express');
const router = express.Router();
const User = require('../../db/user'); // Đảm bảo bạn đã định nghĩa User schema ở đây

// Lấy thông tin người dùng từ cơ sở dữ liệu
router.get('/', async (req, res) => {
  try {
    // Trích xuất email của người dùng từ yêu cầu
    const { email } = req.body;

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
// Thêm vào phương thức PUT trong editprofile.js
router.put('', async (req, res) => {
  try {
    const { email, fullName, phone } = req.body;

    // Tìm và cập nhật người dùng dựa trên email
    const updatedUser = await User.findOneAndUpdate({ email }, { fullName, phone }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Cập nhật sessionStorage sau khi lưu thành công vào cơ sở dữ liệu
    req.session.userInfo = { email: updatedUser.email, fullName: updatedUser.fullName, phone: updatedUser.phone };

    res.status(200).json({ message: 'Thông tin cá nhân đã được cập nhật.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi.' });
  }
});


module.exports = router;
