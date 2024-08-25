const express = require("express");
const multer = require("multer");
const path = require("path");

const Field = require("../../db/field");
const Schedule = require("../../db/schedule");

const router = express.Router();

router.get("/fields-and-schedules/", async (req, res) => {
  try {
    const { fieldName, dateFrom, dateTo } = req.query;
    let fields = await Field.find({
      name: { $regex: ".*" + fieldName + ".*", $options: "i" },
    });
    console.log("🚀 ~ router.get ~ fields:", fields);

    fields = await Promise.all(
      fields.map(async (field) => {
        const schedules = await Schedule.find({
          fieldId: field?._id,
          date: {
            $gte: dateFrom,
            $lte: dateTo,
          },
        });
        let numOfBookedSlots = 0;
        schedules.forEach((schedule) => {
          schedule.slots.forEach((slot) => {
            if (slot.status === "booked") numOfBookedSlots++;
          });
        });
        return {
          id: field._id,
          name: field.name,
          address: field.address,
          area: field.area,
          numOfBookedDays: schedules?.length || 0,
          numOfBookedSlots,
        };
      })
    );
    console.log("🚀 ~ router.get ~ fields:", fields);
    res.status(200).json(fields);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
});

router.get("/", async (req, res) => {
  try {
    const fields = await Field.find();
    res.status(200).json(fields);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id; // Lấy giá trị của tham số từ route
    const fieldDetail = await Field.findById(id);
    res.status(200).json(fieldDetail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Thay đổi thư mục đích để lưu trữ hình ảnh
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

router.post(
  "/",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "detailImg", maxCount: 3 },
  ]),
  async (req, res) => {
    try {
      // console.log(req.body)
      console.log(req);
      const fieldData = JSON.parse(req.body.fieldData || "") || {};
      const duplicateFieldName = await Field.findOne({ name: fieldData.name });
      console.log("🚀 ~ duplicateFieldName:", duplicateFieldName)
      if (duplicateFieldName) {
        res.status(500).json({ message: "Tên sân đã tồn tại" });
        return;
      }
      const detailImgNames =
        req.files?.detailImg?.map((file) => file.filename) || [];
      const field = new Field({
        ...fieldData,
        avatarSrc: req.files?.avatar?.[0]?.filename,
        detailImgSrc: JSON.stringify(detailImgNames),
      });
      console.log(field);

      await field.save();
      res.status(201).json(field);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Đã xảy ra lỗi" });
    }
  }
);

// Cập nhật sân kèm theo cập nhật hình ảnh
router.put(
  "/:id",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "detailImg", maxCount: 3 },
  ]),
  async (req, res) => {
    try {
      const updateData = JSON.parse(req.body.fieldData || "") || {};
      const fieldId = req.params.id;

      const field = await Field.findById(fieldId);

      if (!field) {
        return res.status(404).json({ message: "Không tìm thấy sân" });
      }

      if (req.files) {
        // Nếu có hình ảnh mới được tải lên, cập nhật đường dẫn hình ảnh
        if (req.files?.avatar?.[0])
          updateData.avatarSrc = req.files.avatar[0].filename;
        const newDetailImgs =
          req.files?.detailImg?.map((file) => file.filename) || [];
        const detailImgsToKeep = updateData?.detailImgKeep || [];
        updateData.detailImgSrc = JSON.stringify(
          detailImgsToKeep.concat(newDetailImgs)
        );
      }

      const updatedField = await Field.findByIdAndUpdate(fieldId, updateData, {
        new: true,
      });

      res.status(200).json(updatedField);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Đã xảy ra lỗi" });
    }
  }
);

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Giá trị _id không hợp lệ" });
    }

    const deletedField = await Field.findByIdAndRemove(id);
    if (!deletedField) {
      return res.status(404).json({ message: "Không tìm thấy sân để xóa" });
    }
    res.status(200).json({ message: "Xóa sân thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
});
module.exports = router;
