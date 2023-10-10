// services/productService.js

import axios from 'axios';

const apiUrl = 'http://localhost:5000/api/products'; // Định nghĩa đường dẫn API

// Hàm lấy danh sách sản phẩm
export async function getProducts() {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    throw error; // Xử lý lỗi nếu có
  }
}
