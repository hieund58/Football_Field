import axios from 'axios';

const url = 'http://localhost:5000/api/revenue';

export async function getMostBookedFields(params) {
  try {
    const response = await axios.get(`${url}/most-booked-fields`, { params });
    return response.data;
  } catch (error) {
    throw error; // Xử lý lỗi nếu có
  }
}

export async function getFieldAreaIncome(params) {
  try {
    const response = await axios.get(`${url}/field-area-income`, { params });
    return response.data;
  } catch (error) {
    throw error; // Xử lý lỗi nếu có
  }
}

export async function getTopFiveProducts(params) {
  try {
    const response = await axios.get(`${url}/top-five-products`, { params });
    return response.data;
  } catch (error) {
    throw error; // Xử lý lỗi nếu có
  }
}

export async function getProductIncomeByType(params) {
  try {
    const response = await axios.get(`${url}/product-income-by-type`, { params });
    return response.data;
  } catch (error) {
    throw error; // Xử lý lỗi nếu có
  }
}
