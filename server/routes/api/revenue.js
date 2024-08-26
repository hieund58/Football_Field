// doanh thu
const express = require("express");
const router = express.Router();
const Payment = require("../../db/payment");
const Field = require("../../db/field");
const Product = require("../../db/product");

async function getFieldsBookedNumber(dateFrom, dateTo) {
  // tìm số lần các sân được đặt trong khoảng ngày
  const payments = await Payment.find({
    type: "booking",
    status: "paid",
    "bookingData.scheduleDate": {
      $gte: dateFrom,
      $lte: dateTo,
    },
  });
  const fieldIds = payments.map((item) => item.bookingData.fieldId); // lấy mảng fieldId từ thanh toán
  const fieldOccurrence = {}; // tạo biến đếm số lần đặt theo fieldId dạng { fieldId: số lần đặt }
  // duyệt mảng fieldIds đếm số lần xuất hiện của từng fieldId
  for (const fieldId of fieldIds) {
    fieldOccurrence[fieldId] = fieldOccurrence[fieldId]
      ? fieldOccurrence[fieldId] + 1
      : 1;
  }
  return fieldOccurrence;
}

router.get("/most-booked-fields", async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query; // lấy tham số truyền từ FE

    const bookedNumbers = await getFieldsBookedNumber(dateFrom, dateTo);

    const top5Fields = Object.entries(bookedNumbers) // Tìm 5 fields có lần xuất hiện nhiều nhất, tương đương 5 fields đc đặt nhiều nhất
    .sort((a, b) => b[1] - a[1])
    console.log('top5Fields',top5Fields);
    
    // trả về mảng có tên field tương ứng
    let fieldNumber = await Promise.all(
      top5Fields?.map(async (field) => {
        const fieldDetail = await Field.findById(field[0]); // Tìm field detail theo id
        console.log('fieldDetail',fieldDetail);
        return {
          fieldId: field[0],
          fieldName: fieldDetail?.name,
          bookedTimes: field[1],
        };
      })
    );
    fieldNumber = fieldNumber.filter(field => !!field.fieldName)
    .slice(0, 5);
    
    return res.status(201).json(fieldNumber);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
});

router.get("/field-area-income", async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query; // lấy tham số truyền từ FE

    const bookedNumbers = await getFieldsBookedNumber(dateFrom, dateTo);

    // trả về mảng có tên field tương ứng
    let fieldNumber = await Promise.all(
      Object.entries(bookedNumbers)?.map(async (field) => {
        const fieldDetail = await Field.findById(field[0]); // Tìm field detail theo id
        return {
          fieldId: field[0],
          area: fieldDetail?.area,
          totalIncome: Number(field[1]) * fieldDetail?.price || 0,
        };
      })
    );
    fieldNumber = fieldNumber.filter(field => !!field.area)

    const result = [];

    fieldNumber.forEach((item) => {
      const existing = result.find((r) => r.area === item.area);
      if (existing) {
        existing.totalIncome += item.totalIncome;
      } else {
        result.push({ area: item.area, totalIncome: item.totalIncome });
      }
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
});

async function getProductIncomes(dateFrom, dateTo) {
  // tìm số tiền thanh toán theo sản phẩm
  const payments = await Payment.find({
    type: "purchase",
    status: "paid",
    finishedDate: {
      $gte: dateFrom,
      $lte: dateTo,
    },
  });
  const purchaseData = payments.map((item) => item.purchaseData); // lấy mảng fieldId từ thanh toán
  const result = [];

  purchaseData.flat().forEach((item) => {
    const existing = result.find((r) => r.productId === item.productId);
    if (existing) {
      existing.quantity = Number(existing.quantity) + Number(item.quantity);
      existing.totalIncome = Number(existing.quantity) * Number(existing.price);
    } else {
      result.push({
        productId: item.productId,
        price: item.price,
        quantity: item.quantity,
        totalIncome: Number(item.quantity) * Number(item.price),
      });
    }
  });
  return result;
}

router.get("/top-five-products", async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query; // lấy tham số truyền từ FE

    const productIncomes = await getProductIncomes(dateFrom, dateTo);
    console.log("🚀 ~ router.get ~ productIncomes:", productIncomes);
    const top5Products = productIncomes
      .sort((a, b) => b.totalIncome - a.totalIncome)
      .slice(0, 5);

    // trả về mảng có tên field tương ứng
    const productNames = await Promise.all(
      top5Products?.map(async (product) => {
        const productDetail = await Product.findById(product.productId); // Tìm product detail theo id
        return {
          productName: productDetail.name,
          price: Number(product.price),
          quantity: Number(product.quantity),
          totalIncome: Number(product.totalIncome),
        };
      })
    );

    return res.status(201).json(productNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
});

router.get("/product-income-by-type", async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query; // lấy tham số truyền từ FE

    const productIncomes = await getProductIncomes(dateFrom, dateTo);
    console.log("🚀 ~ router.get ~ productIncomes:", productIncomes);

    // trả về mảng có tên field tương ứng
    const productNames = await Promise.all(
      productIncomes?.map(async (product) => {
        const productDetail = await Product.findById(product.productId); // Tìm product detail theo id
        return {
          type: productDetail.type,
          totalIncome: Number(product.totalIncome),
        };
      })
    );

    const result = [];

    productNames.forEach((item) => {
      const existing = result.find((r) => r.type === item.type);
      if (existing) {
        existing.totalIncome += item.totalIncome;
      } else {
        result.push({ type: item.type, totalIncome: item.totalIncome });
      }
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
});

module.exports = router;
