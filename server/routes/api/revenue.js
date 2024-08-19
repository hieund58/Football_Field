const express = require("express");
const router = express.Router();
const Payment = require("../../db/payment");
const Field = require("../../db/field");

async function getPaidPayments(dateFrom, dateTo) {
  const payments = await Payment.find({
    type: "booking",
    status: "paid",
    "bookingData.scheduleDate": {
      $gte: dateFrom,
      $lte: dateTo,
    },
  });
  return payments;
}

router.get("/most-booked-fields", async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query; // lấy tham số truyền từ FE

    const payments = await getPaidPayments(dateFrom, dateTo); // tìm tất cả thanh toán trong khoảng ngày
    const fieldIds = payments.map((item) => item.bookingData.fieldId); // lấy mảng fieldId từ thanh toán
    const fieldOccurrence = {}; // tạo biến đếm số lần đặt theo fieldId dạng { fieldId: số lần đặt }
    // duyệt mảng fieldIds đếm số lần xuất hiện của từng fieldId
    for (const fieldId of fieldIds) {
      fieldOccurrence[fieldId] = fieldOccurrence[fieldId]
        ? fieldOccurrence[fieldId] + 1
        : 1;
    }

    const top5Fields = Object.entries(fieldOccurrence) // Tìm 5 fields có lần xuất hiện nhiều nhất, tương đương 5 fields đc đặt nhiều nhất
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // trả về mảng có tên field tương ứng
    const fieldNumber = await Promise.all(
      top5Fields?.map(async (field) => {
        const fieldDetail = await Field.findById(field[0]); // Tìm field detail theo id
        return {
          fieldId: field[0],
          fieldName: fieldDetail.name,
          bookedTimes: field[1],
        };
      })
    );

    return res.status(201).json(fieldNumber);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
});

module.exports = router;
