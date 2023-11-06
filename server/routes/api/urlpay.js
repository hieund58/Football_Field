const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
const config = require('../../config');

// Đường dẫn để xử lý phản hồi từ VNPay sau khi thanh toán
router.post('/vnpay_return', (req, res) => {
  // Xử lý phản hồi từ VNPay ở đây
  // Kiểm tra chữ ký an toàn và cập nhật trạng thái đơn hàng

  // Ví dụ kiểm tra chữ ký an toàn (vnp_SecureHash) từ phản hồi
  const secureHash = req.body.vnp_SecureHash;
  const vnpData = req.body;
  delete vnpData.vnp_SecureHash;

  const secretKey = config.vnp_HashSecret;

  const sortedKeys = Object.keys(vnpData).sort();
  const queryString = sortedKeys.map((key) => key + '=' + vnpData[key]).join('&');

  const hmac = crypto.createHmac('SHA256', secretKey);
  hmac.update(queryString);

  const calculatedSecureHash = hmac.digest('hex').toUpperCase();

  if (secureHash === calculatedSecureHash) {
    // Chữ ký hợp lệ, xác nhận thanh toán
    // Cập nhật trạng thái đơn hàng, ghi nhật ký, vv.

    res.status(200).send('GD0000|Success');
  } else {
    // Chữ ký không hợp lệ
    res.status(400).send('GD0001|Fail');
  }
});

// API để tạo đơn hàng và lấy URL thanh toán từ VNPay
router.post('/', async (req, res) => {
  try {
    const vnPayData = {
      vnp_TmnCode: config.vnp_TmnCode,
      vnp_HashSecret: config.vnp_HashSecret,
      vnp_Url: config.vnp_Url,
      vnp_ReturnUrl: config.vnp_ReturnUrl,
      // Thêm các thông tin khác cần thiết
      amount: req.body.amount,
      orderDescription: req.body.orderDescription,
      bankCode: req.body.bankCode || '',
      orderType: req.body.orderType || 'normal',
      language: req.body.language || 'vn',
    };

    // Tạo chuỗi xác thực chữ ký an toàn
    const sortedKeys = Object.keys(vnPayData).sort();
    const queryString = sortedKeys.map((key) => key + '=' + vnPayData[key]).join('&');

    const secretKey = config.vnp_HashSecret;
    const hmac = crypto.createHmac('SHA256', secretKey);
    hmac.update(queryString);

    const vnpSecureHash = hmac.digest('hex').toUpperCase();

    vnPayData.vnp_SecureHash = vnpSecureHash;

    // Gửi yêu cầu tạo đơn hàng tới VNPay
    const response = await axios.post(config.vnp_Api, vnPayData);

    // Trích xuất URL thanh toán VNPay từ phản hồi
    const paymentUrl = response.data;

    // Gửi URL thanh toán về cho máy khách
    res.json({ paymentUrl });
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng và chuyển hướng đến VNPay:', error);
    res.status(500).json({ error: 'Lỗi khi tạo đơn hàng và chuyển hướng đến VNPay' });
  }
});

module.exports = router;
