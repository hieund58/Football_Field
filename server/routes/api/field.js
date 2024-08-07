const express = require('express');
const router = express.Router();
const Field = require('../../db/field');
const multer = require('multer');
const path = require('path');


// Lấy danh sách sản phẩm
router.get('/', async (req, res) => {
  try {
    const fields = await Field.find(); 
    res.status(200).json(fields);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id; // Lấy giá trị của tham số từ route
    const fieldDetail = await Field.findById(id); // Tìm sản phẩm bằng ID
    res.status(200).json(fieldDetail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Thay đổi thư mục đích để lưu trữ hình ảnh
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/', upload.array('images'), async (req, res) => {
    // console.log(req.body)
    // console.log(req.files)
    const detailImgNames = req.files?.map(file => file.filename)?.slice(1)
  try {
    const fieldData = JSON.parse(req.body.fieldData || '') || {}
    const field = new Field({
      ...fieldData,
      avatarSrc: req.files[0].filename,
      detailImgSrc: JSON.stringify(detailImgNames)
    });
    console.log(field)

    await field.save();
    res.status(201).json(field);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});


// Cập nhật sân kèm theo cập nhật hình ảnh
router.put('/:id', upload.fields([
  { name: 'avatar', maxCount: 1},
  { name: 'detailImg', maxCount: 3}
]), async (req, res) => {
  try {
    const updateData = JSON.parse(req.body.fieldData || '') || {};
    const fieldId = req.params.id;

    const field = await Field.findById(fieldId);

    if (!field) {
      return res.status(404).json({ message: 'Không tìm thấy sân' });
    }

    if (req.files) {
      // Nếu có hình ảnh mới được tải lên, cập nhật đường dẫn hình ảnh
      if (req.files?.avatar) updateData.avatarSrc = req.files.avatar.filename;
      const newDetailImgs = req.files?.detailImg?.map(file => file.filename) || [];
      const detailImgsToKeep = updateData?.detailImgKeep || []
      updateData.detailImgSrc = JSON.stringify(detailImgsToKeep.concat(newDetailImgs));
    }

    const updatedField = await Field.findByIdAndUpdate(fieldId, updateData, { new: true });

    res.status(200).json(updatedField);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'Giá trị _id không hợp lệ' });
    }
    
    const deletedField = await Field.findByIdAndRemove(id);
    if (!deletedField) {
      return res.status(404).json({ message: 'Không tìm thấy sân để xóa' });
    }
    res.status(200).json({ message: 'Xóa sân thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});


module.exports = router;
