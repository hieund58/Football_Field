const express = require('express');
const router = express.Router();
const User = require('../../db/user');

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    // Chỉ cho đăng ký làm user
    const newUser = new User({ email, password, role: 'user' });

    await newUser.hashPassword();

    await newUser.save();

    return res.status(201).json({ message: 'Đăng ký thành công', success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

module.exports = router;
