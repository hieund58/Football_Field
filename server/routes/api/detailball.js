const express = require('express');
const router = express.Router();
const Product_field = require('../../db/detailball');
const mongoose = require('mongoose');


// Định nghĩa tuyến đường API để trả về chi tiết sân
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id; // Lấy giá trị id từ đường dẫn URL

    const detailField = await Product_field.findOne({ _id: productId });

    if (!detailField) {
      return res.status(404).json({ error: 'Không tìm thấy chi tiết sân.' });
    }

    return res.json(detailField);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết sân:', error);
    return res.status(500).json({ error: 'Lỗi khi lấy dữ liệu.' });
  }
});

module.exports = router;

