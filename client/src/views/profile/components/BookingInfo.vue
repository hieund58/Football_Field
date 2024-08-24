<template>
  <div class="flex flex-col justify-between h-full">
    <div>
      <h1 class="text-lg font-bold mb-2">Thông tin sân đã đặt</h1>
      <n-input-group>
        <n-date-picker v-model:value="searchDateRange" type="daterange" format="dd-MM-yyyy" class="!w-[300px]" />
        <n-button ghost @click="handleSearch">
            <template #icon>
              <n-icon><SearchOutline /></n-icon>
            </template>
          </n-button>
          <n-button ghost @click="handleReset">
            <template #icon>
              <n-icon><ReloadOutline /></n-icon>
            </template>
          </n-button>
      </n-input-group>
      <table class="transaction-table">
        <thead>
          <tr class="header">
            <th>STT</th>
            <th>Tên Sân</th>
            <th>Địa Chỉ</th>
            <th>Thời Gian Giao Dịch</th>
            <th>Số tiền</th>
            <th>Trạng thái giao dịch</th>
            <th>Hoá Đơn</th>
            <!-- Thêm cột Hoá Đơn -->
          </tr>
        </thead>
        <tbody class="w-full">
          <tr v-for="(san, index) in filteredData" :key="index" class="content-tt">
            <td>{{ index + 1 }}</td>
            <td>{{ san?.fieldDetail?.name }}</td>
            <td>{{ san?.fieldDetail?.address }}</td>
            <td>{{ DateTime.fromISO(san.createdDate).toFormat('dd-MM-yyyy HH:mm:ss') }}</td>
            <td>{{ formatMoney(san?.fieldDetail?.price) }}</td>
            <td>{{ san.status }}</td>
            <td>
              <button @click="viewInvoice(san)">Xem Hoá Đơn</button>
              <!-- Thêm nút Xem Hoá Đơn -->
            </td>
          </tr>
        </tbody>

      </table>
      <div v-if="!filteredData.length" class="w-full h-[50px] flex justify-center items-center">Không có dữ liệu</div>
    </div>

    <div v-if="data.length" class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">
        <font-awesome-icon class="pagination-icon" :icon="['fas', 'arrow-left']" />
      </button>
      <span>Trang {{ page }}/{{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage * 10 >= filteredData.length">
        <font-awesome-icon class="pagination-icon" :icon="['fas', 'arrow-right']" />
      </button>
    </div>

    <div class="modal" v-if="showInvoice">
      <div class="modal-content">
        <div class="flex flex-row justify-between">
          <span class="font-bold text-2xl">Hoá Đơn</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="24"
            height="24"
            viewBox="0 0 50 50"
            class="hover:cursor-pointer"
            @click="closeInvoice"
          >
            <path
              d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"
            ></path>
          </svg>
        </div>

        <div class="invoice-details">
          <div class="invoice-header">
            <p class="invoice-title">Hoá Đơn Thanh Toán</p>
            <p class="invoice-date">
              Ngày: {{ DateTime.fromISO(selectedReservation.createdDate).toFormat('dd-MM-yyyy') }}
            </p>
          </div>
          <div class="invoice-body">
            <p>
              <strong>Tên Sân:</strong>
              {{ selectedReservation ? selectedReservation.fieldDetail.name : '' }}
            </p>
            <p>
              <strong>Địa Chỉ:</strong>
              {{ selectedReservation ? selectedReservation.fieldDetail.address : '' }}
            </p>
            <p>
              <strong>Thời Gian Giao Dịch:</strong>
              {{
                selectedReservation
                  ? DateTime.fromISO(selectedReservation.createdDate).toFormat('dd-MM-yyyy HH:mm:ss')
                  : ''
              }}
            </p>
            <p>
              <strong>Người giao dịch:</strong>
              {{
                selectedReservation?.fromUser
              }}
            </p>
            <p>
              <strong>Số tiền:</strong>
              {{ selectedReservation ? formatMoney(selectedReservation.fieldDetail.price) : '' }}
            </p>
            <p>
              <strong>Trạng thái giao dịch:</strong>
              {{ selectedReservation ? selectedReservation.status : '' }}
            </p>
          </div>
          <div class="invoice-footer">
            <p class="total-amount">
              <strong>Tổng cộng:</strong>
              {{ selectedReservation ? formatMoney(selectedReservation.fieldDetail.price) : '' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { DateTime } from 'luxon';
import { Eye, SearchOutline, ReloadOutline } from '@vicons/ionicons5';

import { getUserData, formatQueryDate, formatDateVn, formatMoney } from '@/utils/common';

const searchDateRange = ref([DateTime.now().minus({ days: 7 }).toJSDate(), DateTime.now().toJSDate()]);
const page = ref(1);
const pageSize = 10;
const data = ref([]);

const totalPages = computed(() => Math.ceil(data.value.length / pageSize));

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
  }
};

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++;
  }
};


let filteredData = computed(() => {
  const startIdx = (page.value - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  return data.value.slice(startIdx, endIdx);
});
const showInvoice = ref(false);
const selectedReservation = ref(null);

const viewInvoice = san => {
  selectedReservation.value = san;
  showInvoice.value = true;
};

const closeInvoice = () => {
  showInvoice.value = false;
};

const handleSearch = async () => {
  try {
    const params = {
      fromUser: getUserData()?.email,
      dateFrom: formatQueryDate(searchDateRange.value[0]),
      dateTo: formatQueryDate(searchDateRange.value[1]),
      type: 'booking'
    };
    const response = await axios.get('http://localhost:5000/api/process-payment', { params });
    data.value = response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin các sân đã được đặt:', error);
  }
}

const handleReset = () => {
  data.value = []
}

</script>

<style lang="scss" scoped>
.transaction-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e0e0e0;
  margin: 20px 0px;
  display: table
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
  color: #007bff;
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
  width: 500px;
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
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
}

.invoice-title {
  font-size: 18px;
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
