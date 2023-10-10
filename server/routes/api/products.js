const express = require('express');
const router = express.Router();
const Product = require('../../db/products_field');
const mongoose = require('mongoose');


// Lấy danh sách sản phẩm
router.get('/', async (req, res) => {
  try {
    const products_field = await Product.find(); // Sử dụng phương thức find() để lấy tất cả các người dùng
    res.status(200).json(products_field);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

module.exports = router;
