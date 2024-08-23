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
        return_url: url,
        cancel_url: url,
      },
    });

    let response = await client.execute(request);
    // console.log(`Response: ${JSON.stringify(response)}`);

    // If call returns body in response, you can get the deserialized version from the result attribute of the response.
    // console.log(`Order: ${JSON.stringify(response.result)}`);

    const approvalUrl = response?.result?.links?.find(
      (link) => link.rel === "approve"
    ).href;

    const newPayment = new Payment({
      paymentId: response.result?.id,
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
    res.json({ approvalUrl });
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
    // Call API with your client and get a response for your call
    let response = await client.execute(request);
    // console.log(`Response: ${JSON.stringify(response)}`);
    // If call returns body in response, you can get the deserialized version from the result attribute of the response.
    console.log(`Capture: ${JSON.stringify(response.result)}`);

    await Payment.findOneAndUpdate(
      { paymentId },
      {
        status: "paid",
        finishedDate: new Date(),
        paymentDetail: response.result,
      }
    );
    const paidPayment = await Payment.findOne({ paymentId });
    console.log("🚀 ~ router.post ~ paidPayment:", paidPayment);

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

// Lấy danh sách đơn hàng
router.get("/list", async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách đơn hàng" });
  }
});

module.exports = router;
