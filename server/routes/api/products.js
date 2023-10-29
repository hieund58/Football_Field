const express = require('express');
const router = express.Router();
const Product = require('../../db/product');
const multer = require('multer');
const mongoose = require('mongoose');


// Lấy danh sách sản phẩm
router.get('/', async (req, res) => {
  try {
    const products_field = await Product.find(); // Sử dụng phương thức find() để lấy tất cả các người dùng
    res.status(200).json(products_field);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id; // Lấy giá trị của tham số từ route
    const product = await Product.findById(productId); // Tìm sản phẩm bằng ID
    res.status(200).json(product);
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
// Thêm sản phẩm mới kèm theo hình ảnh
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (req.file) {
      const newProduct = new Product({
        ...req.body,
        imageSrc: '/uploads/' + req.file.filename, // URL đến hình ảnh trên máy chủ
      });

      await newProduct.save();
      res.status(201).json(newProduct);
    } else {
      res.status(400).json({ message: 'Hình ảnh không hợp lệ' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

// Cập nhật sản phẩm kèm theo cập nhật hình ảnh
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updatedProductData = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    if (req.file) {
      // Nếu có hình ảnh mới được tải lên, cập nhật đường dẫn hình ảnh
      updatedProductData.imageSrc = '/uploads/' + req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});


// Xóa sản phẩm
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndRemove(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa' });
    }
    res.status(204).end(); // 204 No Content
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

module.exports = router;
