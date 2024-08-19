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
