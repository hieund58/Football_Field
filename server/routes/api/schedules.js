const express = require('express');
const router = express.Router();
const Schedule = require('../../db/schedule');
const mongoose = require('mongoose');
// Định nghĩa một tuyến đường API để lấy thông tin lịch sân cho ngày cụ thể
router.get('/get-schedule-by-date/:date', async (req, res) => {
  const requestedDate = new Date(req.params.date); // Parse ngày từ tham số yêu cầu

  try {
    // Tìm thông tin lịch sân cho ngày được yêu cầu
    const schedule = await Schedule.findOne({ date: requestedDate });

    if (schedule) {
      res.json({ schedule });
    } else {
      res.json({ message: 'Không tìm thấy lịch sân cho ngày này.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lấy lịch sân.' });
  }
});
// Trên máy chủ
// Tuyến đường API để cập nhật số sân
router.put('/update-court/:date', async (req, res) => {
  try {
    const { date } = req.params; // Lấy ngày từ tham số đường dẫn
    const { hour, court } = req.body;

    // Tìm lịch sân cho ngày cụ thể và giờ cụ thể và cập nhật số sân
    const updatedSchedule = await Schedule.findOneAndUpdate(
      { date: new Date(date), 'slots.hour': hour },
      { $set: { 'slots.$.court': court } },
      { new: true }
    );

    res.json({ updatedSchedule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi cập nhật số sân.' });
  }
});

// Tuyến đường API để cập nhật giá tiền
router.put('/update-price/:date', async (req, res) => {
  try {
    const { date } = req.params; // Lấy ngày từ tham số đường dẫn
    const { hour, price } = req.body;

    // Tìm lịch sân cho ngày cụ thể và giờ cụ thể và cập nhật giá tiền
    const updatedSchedule = await Schedule.findOneAndUpdate(
      { date: new Date(date), 'slots.hour': hour },
      { $set: { 'slots.$.price': price } },
      { new: true }
    );

    res.json({ updatedSchedule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi cập nhật giá tiền.' });
  }
});

module.exports = router;
