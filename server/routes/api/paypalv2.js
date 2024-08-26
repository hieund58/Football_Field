const express = require("express");
const { DateTime } = require("luxon");
const paypal = require("@paypal/checkout-server-sdk");

const Payment = require("../../db/payment"); // Import your Payment model
const Schedule = require("../../db/schedule");
const Product = require("../../db/product");

const router = express.Router();

// Creating an environment
let clientId =
  "AYaRxtIuiBQgFhueRq6JlPYYw7PeCQYfSzFNP3QhYOU7uZ6EMR383Kg1XiwjAPn08U4s5Juj6TKLbWW6";
let clientSecret =
  "ENHWA80x_glbHjjrAhqSPYgJyVIGpVIpi2tWn6F6FH0DDAq-kjca09JAEyAIVXbBy2kJ7uMZsMqSq71M";

// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

// Tạo đơn hàng mới
router.post("/create", async (req, res) => {
  try {
    const { bookingData, purchaseData, type, fromUser, price, paymentMethod } =
      req.body;
    // yêu cầu tạo giao dịch
    let request = new paypal.orders.OrdersCreateRequest();

    const url =
      type === "booking"
        ? `http://localhost:5173/detailball/${bookingData?.fieldId}`
        : "http://localhost:5173/store";

    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: price,
          },
        },
      ],
      application_context: {
        return_url: url,// thanh toàn thành công thì đưa về địa chỉ này
        cancel_url: url,// không thanh toán thì đưa để chỉ này
      },
    });
    //await gọi api giao dịch
    let response = await client.execute(request);
    // response là cái trả về "đã được tạo"

    // cho người confirm thanh toán
    const approvalUrl = response?.result?.links?.find(
      (link) => link.rel === "approve"
    ).href;

    const newPayment = new Payment({
      paymentId: response.result?.id,//Lưu id giao dịch vào DB
      bookingData,
      purchaseData,
      type,
      fromUser,
      price,
      paymentMethod: paymentMethod || "banking",
      status: "pending",
      createdDate: new Date(),
    });

    await newPayment.save();
    res.json({ approvalUrl });//Trả FE link tới trang thanh toán
  } catch (error) {
    console.log("🚀 ~ router.post ~ error:", error);
    res.status(500).json({ error: "Lỗi khi tạo đơn hàng" });
  }
});

// Xác nhận thanh toán PayPal
router.post("/execute", async (req, res) => {
  const { paymentId } = req.body;

  try {
    request = new paypal.orders.OrdersCaptureRequest(paymentId);
    request.requestBody({});
    //BE gọi api để lưu thông tin giao dịch trên sever của paypal
    let response = await client.execute(request);

    await Payment.findOneAndUpdate(
      { paymentId },
      {
        status: "paid",//update trạng thái là đã thanh toán
        finishedDate: new Date(),//ngày thanh toán thành công
        paymentDetail: response.result,// thông tin riêng của paypal ( hóa đơn của paypal)
      }
    );
    const paidPayment = await Payment.findOne({ paymentId });

    if (paidPayment && paidPayment?.type === "booking") {
      const formattedDate = DateTime.fromJSDate(
        paidPayment.bookingData?.scheduleDate
      ).toFormat("yyyy-MM-dd");
      await Schedule.updateSlotInfo(
        paidPayment.bookingData?.fieldId,
        formattedDate,
        paidPayment.bookingData?.scheduleSlotHour,
        "booked",
        paidPayment.fromUser
      );
    }

    if (paidPayment && paidPayment?.type === "purchase") {
      paidPayment.purchaseData.forEach(async (purchased) => {
        const product = await Product.findById(purchased?.productId);
        console.log("🚀 ~ router.post ~ product:", product);
        product.updateRemaining(purchased?.quantity);
        await product.save();
      });
    }
    res.json({ message: "Thanh toán thành công" });
  } catch (error) {
    console.log("Thanh toán error: ", error);
    await Payment.findOneAndUpdate({ paymentId }, { status: "error" });
    res.status(500).json({ message: "Có lỗi khi thanh toán" });
  }
});

module.exports = router;
