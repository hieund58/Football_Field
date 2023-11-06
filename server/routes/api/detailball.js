const express = require('express');
const router = express.Router();
const Payment = require('../../db/detailball');

router.post('/', async (req, res) => {
  try {
    const {name,people,address, username, sanId, selectDate, selectTime, price, paymentMethod,status } = req.body;

    const newPayment = new Payment({
      name,
      people,
      address,
      username,
      sanId,
      selectDate,
      selectTime,
      price,
      paymentMethod,
      status,
    });

    await newPayment.save(); // Lưu thông tin thanh toán vào MongoDB

    res.status(200).json({ message: 'Thanh toán thành công' });
  } catch (error) {
    console.error('Lỗi khi xử lý thanh toán:', error);
    res.status(500).json({ error: 'Lỗi khi xử lý thanh toán' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const _id = req.params.id; // Lấy giá trị _id từ tham số URL
    const { status } = req.body; // Lấy giá trị status từ request body

    // Tìm bản ghi thanh toán dựa trên _id và cập nhật trạng thái mới
    const updatedPayment = await Payment.findOneAndUpdate(
      { _id },
      { status },
      { new: true } // Trả về bản ghi sau khi cập nhật
    );

    if (updatedPayment) {
      res.status(200).json({ message: 'Cập nhật trạng thái thanh toán thành công' });
    } else {
      res.status(404).json({ error: 'Không tìm thấy bản ghi thanh toán' });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái thanh toán:', error);
    res.status(500).json({ error: 'Lỗi khi cập nhật trạng thái thanh toán' });
  }
});
// Route để lấy thông tin các sân đã được đặt
router.get('/', async (req, res) => {
  try {
    // Sử dụng Mongoose để lấy dữ liệu các sân đã được đặt từ MongoDB
    const bookedFields = await Payment.find();

    res.status(200).json(bookedFields);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin các sân đã được đặt:', error);
    res.status(500).json({ error: 'Lỗi khi lấy thông tin các sân đã được đặt' });
  }
});
module.exports = router;
