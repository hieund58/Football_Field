// services/productService.js

import axios from "axios";

const productUrl = "http://localhost:5000/api/products";

// Hàm lấy danh sách sản phẩm
export async function getProducts() {
  try {
    const response = await axios.get(productUrl);
    return response.data;
  } catch (error) {
    throw error; // Xử lý lỗi nếu có
  }
}
