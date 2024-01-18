// paymentController.js
const express = require('express');
const router = express.Router();
const Payment = require('../../db/detailball'); // Import your Payment model
const paypal = require('../../config');
// Tạo đơn hàng mới
router.post('/create', async (req, res) => {
    try {
      const {
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
      } = req.body;
  
      const createPayment = {
        intent: 'sale',
        payer: {
          payment_method: paymentMethod, // 'paypal' hoặc 'credit_card'
        },
        transactions: [
          {
            amount: {
              total: price,
              currency: 'USD',
            },
            description: 'Mô tả đơn hàng của bạn',
          },
        ],
      };
  
      paypal.payment.create(createPayment, function (error, payment) {
        if (error) {
          throw error;
        } else {
          // Lấy URL redirect để xác nhận thanh toán
          const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
  
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
            // Thêm trường paymentId để lưu ID đơn hàng PayPal
            paymentId: payment.id,
          });
  
          newPayment.save((err, payment) => {
            if (err) {
              res.status(500).json({ error: 'Lỗi khi lưu đơn hàng' });
            } else {
              res.json({ approvalUrl });
            }
          });
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Lỗi khi tạo đơn hàng' });
    }
  });
  
  // Xác nhận thanh toán PayPal
  router.get('/execute', (req, res) => {
    const paymentId = req.query.paymentId;
    const payerId = { payer_id: req.query.PayerID };
  
    paypal.payment.execute(paymentId, payerId, (error, payment) => {
      if (error) {
        res.status(500).json({ error: 'Lỗi khi xác nhận thanh toán' });
      } else {
        // Đánh dấu đơn hàng là đã thanh toán trong cơ sở dữ liệu
        Payment.findOneAndUpdate({ paymentId }, { status: 'paid' }, (err, payment) => {
          if (err) {
            res.status(500).json({ error: 'Lỗi khi cập nhật trạng thái đơn hàng' });
          } else {
            res.json({ message: 'Thanh toán thành công' });
          }
        });
      }
    });
  });
  
  // Lấy danh sách đơn hàng
  router.get('/list', async (req, res) => {
    try {
      const payments = await Payment.find();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: 'Lỗi khi lấy danh sách đơn hàng' });
    }
  });
  
  module.exports = router;