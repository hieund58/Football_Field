const express = require('express');
const router = express.Router();
const Product = require('../../db/product');
const multer = require('multer');
const path = require('path');

// Lấy danh sách sản phẩm
router.get('/', async (req, res) => {
  try {
    const products_field = await Product.find(); 
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

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData || '') || {}
    console.log("🚀 ~ router.post ~ productData:", productData)
    const newProduct = new Product({
      ...productData
    });

    if (req.file) {
      newProduct.imageSrc = req.file.filename;
    }

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});


// Cập nhật sản phẩm kèm theo cập nhật hình ảnh
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updatedProductData = JSON.parse(req.body.productData || '') || {}
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    if (req.file) {
      // Nếu có hình ảnh mới được tải lên, cập nhật đường dẫn hình ảnh
      updatedProductData.imageSrc = req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true });

    res.status(200).json(updatedProduct);
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
    
    const deletedProduct = await Product.findByIdAndRemove(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa' });
    }
    res.status(200).json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});


module.exports = router;
