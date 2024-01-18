<template>
  <div class="wrapper">
    <h1>Thông tin sân đã đặt</h1>
    <div class="content">
      <table class="transaction-table">
        <thead>
          <tr class="header">
            <th>STT</th>
            <th>Tên Sân</th>
            <th>Địa Chỉ</th>
            <th>Thời Gian Giao Dịch</th>
            <th>Số tiền</th>
            <th>Trạng thái giao dịch</th>
            <th>Hoá Đơn</th> <!-- Thêm cột Hoá Đơn -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(san, index) in filteredData" :key="index" class="content-tt">
            <td>{{ index + 1 }}</td>
            <td>{{ san.name }}</td>
            <td>{{ san.address }}</td>
            <td>{{ san.time }}</td>
            <td>{{ san.price }}</td>
            <td>{{ san.status }}</td>
            <td>
              <button @click="viewInvoice(san)">Xem Hoá Đơn</button> <!-- Thêm nút Xem Hoá Đơn -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">
        <font-awesome-icon class="pagination-icon" :icon="['fas', 'arrow-left']" />
      </button>
      <span>Trang {{ currentPage }}</span>
      <button @click="nextPage" :disabled="currentPage * 10 >= filteredData.length">
        <font-awesome-icon class=" pagination-icon" :icon="['fas', 'arrow-right']" />
      </button>
    </div>
    
    <div class="modal" v-if="showInvoice">
      <div class="modal-content">
        <h2>Hoá Đơn</h2>
        <div class="invoice-details">
          <div class="invoice-header">
            <p class="invoice-title">Hoá Đơn Thanh Toán</p>
            <p class="invoice-date">Ngày: {{ formattedDate }}</p>
          </div>
          <div class="invoice-body">
            <p><strong>Tên Sân:</strong> {{ selectedReservation ? selectedReservation.name : '' }}</p>
            <p><strong>Địa Chỉ:</strong> {{ selectedReservation ? selectedReservation.address : '' }}</p>
            <p><strong>Thời Gian Giao Dịch:</strong> {{ selectedReservation ? selectedReservation.time : '' }}</p>
            <p><strong>Số tiền:</strong> {{ selectedReservation ? selectedReservation.price : '' }}</p>
            <p><strong>Trạng thái giao dịch:</strong> {{ selectedReservation ? selectedReservation.status : '' }}</p>
          </div>
          <div class="invoice-footer">
            <p class="total-amount"><strong>Tổng cộng:</strong> {{ selectedReservation ? selectedReservation.price : '' }}</p>
          </div>
        </div>
      </div>
      <button @click="closeInvoice">Đóng</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const page = ref(1);
const data = ref([]);
const columns = [];

const handlePageChange = (curPage) => {
  page.value = curPage;
};

const paginationRef = computed(() => ({
  pageSize: 10,
  page: page.value,
}));

const userData = JSON.parse(sessionStorage.getItem('userData'));
const statusFilter = 'Đã thanh toán';
let filteredData = ref([]);
const showInvoice = ref(false);
const selectedReservation = ref(null);

const viewInvoice = (san) => {
  selectedReservation.value = san;
  showInvoice.value = true;
};

const closeInvoice = () => {
  showInvoice.value = false;
};

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/process-payment');
    const allData = response.data;
    filteredData.value = allData.filter(item => item.status === statusFilter && item.username === userData.email);
    data.value = filteredData.value;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin các sân đã được đặt:', error);
  }
});
</script>

<style scoped>
.wrapper {
  padding: 15px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding-bottom: 70px;
  height: auto;
}

.wrapper h1 {
  padding: 20px 10px;
  font-size: 30px;
  font-weight: 500;
  text-align: center;
}

.content {
  padding: 10px;
}

.transaction-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e0e0e0;
  margin: 20px 0px;
}

.transaction-table th,
.transaction-table td {
  border: 1px solid #e0e0e0;
  padding: 10px;
  text-align: left;
}

.transaction-table .header {
  background-color: #f5f5f5;
}

.header th {
  text-align: center;
}

.content-tt td {
  text-align: center;
}

.pagination {
  text-align: center;
  padding: 20px;
}

.pagination-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #007BFF;
}

.pagination-button:disabled {
  color: #ccc;
}

.pagination button {
  margin: 0 10px;
}

.pagination-icon {
  padding: 0 10px;
}

.pagination-icon:hover {
  font-size: 17px;
  color: rgb(250, 69, 22);
}
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  justify-content: center;
  align-items: center;
  display: flex;
}

.modal-content {
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
}

.invoice-details {
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 20px;
  background-color: #f9f9f9;
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.invoice-title {
  font-size: 24px;
  font-weight: bold;
}

.invoice-date {
  font-size: 14px;
}

.invoice-body p {
  margin: 10px 0;
}

.total-amount {
  font-weight: bold;
}
</style>

