const express = require('express');
const router = express.Router();
const Schedule = require('../../db/schedule');
const mongoose = require('mongoose');



router.get('/', async (req, res) => {
    try {
        const schedules = await Schedule.find(); // Sử dụng phương thức find() để lấy tất cả các người dùng
        res.status(200).json(schedules);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi' });
      }
  });

module.exports = router;