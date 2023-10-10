const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../../db/user');

// Route GET để lấy tất cả các giá trị người dùng từ cơ sở dữ liệu
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Sử dụng phương thức find() để lấy tất cả các người dùng
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, 'your-secret-key', {
      expiresIn: '1h',
    });

    return res.status(200).json({ message: 'Đăng nhập thành công', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

module.exports = router;
