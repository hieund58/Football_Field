// services/productService.js

import axios from "axios";

const fieldUrl = "http://localhost:5000/api/field";

export async function getFields(params) {
  try {
    const response = await axios.get(fieldUrl, {params});
    return response.data;
  } catch (error) {
    throw error; // Xử lý lỗi nếu có
  }
}
