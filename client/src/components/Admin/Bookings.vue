<template>
  <div class="flex">
    <div class="w-1/5 bg-gray-800 h-screen">
      <div class="text-white p-4">
        <h2 class="text-xl font-bold">Trang chủ Admin</h2>
        <div class="user-info">
          <p>User: {{ getUsernameFromSession }}</p>
          <button @click="logout">Logout</button>
        </div>
      </div>
      <div class="my-4">
        <router-link to="/fields" class="block text-gray-300 hover:bg-gray-700 py-2 px-4">
          Thống kê các sân bóng
        </router-link>
        <router-link to="/bookingDetail" class="block text-gray-300 hover:bg-gray-700 py-2 px-4">
          Sân đang được đặt
        </router-link>
        <router-link to="/UserManager" class="block text-gray-300 hover-bg-gray-700 py-2 px-4">
          Trạng thái người dùng
        </router-link>
        <router-link to="/revenue" class="block text-gray-300 hover:bg-gray-700 py-2 px-4">Doanh Thu</router-link>
      </div>
    </div>
    <div class="w-4/5 bg-white p-4">
      <div class="bookings-container">
        <h1>Thống kê các sân đã được đặt:</h1>
        <table>
          <thead>
            <tr>
              <th>Tên sân</th>
              <th>Kích thước sân</th>
              <th>Ngày</th>
              <th>Giờ</th>
              <th>Thông tin người đặt sân</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Xác nhận</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detail in details" :key="detail._id">
              <td>{{ detail.name }}</td>
              <td>{{ detail.people }}</td>
              <td>{{ detail.selectDate }}</td>
              <td>{{ detail.selectTime }}</td>
              <td>{{ detail.username }}</td>
              <td>{{ detail.price }}</td>
              <td>{{ detail.status }}</td>
              <td>
                <button @click="confirmPayment(detail)">Xác nhận thanh toán</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <router-view></router-view>
    </div>

    <div class="confirmation-dialog" v-if="showConfirmationDialog">
      <div class="confirmation-content mx-auto p-4 bg-white shadow-lg rounded-lg">
        <!-- Hiển thị thông tin của this.confirmationDetail -->
        <h2>Xác nhận thanh toán</h2>
        <p>Tên sân: {{ confirmationDetail.name }}</p>
        <p>Ngày: {{ confirmationDetail.selectDate }}</p>
        <p>Giá: {{ confirmationDetail.price }}</p>

        <!-- Nút xác nhận và hủy -->
        <button @click="confirmPaymentAction">Xác nhận</button>
        <button @click="cancelConfirmation">Hủy</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      details: [],
      showConfirmationDialog: false,
      confirmationDetail: null,
      confirmationSanId: null // Thêm biến confirmationSanId
    };
  },
  created() {
    this.bookedFields();
  },
  computed: {
    getUsernameFromSession() {
      return sessionStorage.getItem('isLoggedIn') === 'true' ? sessionStorage.getItem('userLogin') : 'Chưa đăng nhập';
    }
  },
  methods: {
    logout() {
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('userLogin');
      this.$router.push('/admin');
    },
    async bookedFields() {
      try {
        const response = await axios.get('http://localhost:5000/api/process-payment');
        this.details = response.data;
      } catch (error) {
        console.error('Lỗi khi lấy thông tin các sân đã được đặt:', error);
        return [];
      }
    },
    confirmPayment(detail) {
      console.log('Clicked item _id:', detail._id);
      console.log(detail.sanId);
      this.showConfirmationDialog = true;
      this.confirmationDetail = detail;
      this.confirmationSanId = detail.sanId; // Gán sanId vào biến confirmationSanId
    },
    async confirmPaymentAction() {
      try {
        const _id = this.confirmationDetail._id;
        const sanId = this.confirmationSanId; // Sử dụng confirmationSanId
        const response = await axios.put(`http://localhost:5000/api/process-payment/${_id}`, {
          status: 'Đã thanh toán'
        });

        if (response.data.message === 'Cập nhật trạng thái thanh toán thành công') {
          const updatedDetails = this.details.map(detail => {
            if (detail._id === _id) {
              return { ...detail, status: 'Đã thanh toán' };
            }
            return detail;
          });
          this.details = updatedDetails;

          this.showConfirmationDialog = false;
          await this.updateSchedule(this.confirmationDetail.selectDate, this.confirmationDetail.selectTime, sanId); // Truyền sanId ở đây
        } else {
          console.error('Lỗi khi cập nhật trạng thái.');
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    },

    async updateSchedule(formattedDate, selectTime, sanId) {
      try {
        // Gọi API để cập nhật lịch
        const updateResponse = await this.updateScheduleApi(formattedDate, selectTime, sanId);

        if (updateResponse.message === 'Cập nhật số sân thành công') {
          // Nếu cập nhật thành công, cập nhật local data
          this.updateLocalSchedule(formattedDate, selectTime);
        } else {
          console.error('Lỗi khi cập nhật số sân.');
        }

        // Đóng hộp thoại xác nhận
        this.showConfirmationDialog = false;
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    },

    async updateScheduleApi(formattedDate, selectTime, sanId) {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/schedule/update-court/${formattedDate}/${sanId}/delete`,
          {
            selectTime,
            sanId: sanId
          }
        );
        return response.data;
      } catch (error) {
        throw new Error('Lỗi khi gọi API để cập nhật lịch: ' + error);
      }
    },

    updateLocalSchedule(formattedDate, selectTime) {
      // Tìm và cập nhật local data dựa trên API response
      const updatedDetails = this.details.map(detail => {
        if (detail.selectDate === formattedDate && detail.selectTime === selectTime) {
          return { ...detail, status: 'Đã thanh toán' };
        }
        return detail;
      });

      // Cập nhật local data
      this.details = updatedDetails;
    }
  }
};
</script>

<style>

.bookings-container {
  margin-top: 50px;
  margin-bottom: 100px;
}
.bookings-container h1 {
  margin-bottom: 20px;
  font-size: 30px;
}
.bookings-container table {
  width: 100%;
  border-collapse: collapse;
}
.bookings-container th,
.bookings-container td {
  border: 1px solid #dddddd;
  padding: 8px;
  text-align: left;
}
.bookings-container tr:nth-child(even) {
  background-color: #f2f2f2;
}
.confirmation-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}

.confirmation-content {
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.confirmation-content h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.confirmation-content p {
  margin-bottom: 0.5rem;
}

.confirmation-content button {
  background-color: #3490dc;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  margin-right: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.confirmation-content button:hover {
  background-color: #2779bd;
}

.confirmation-content button:last-child {
  background-color: #e53e3e;
}

.confirmation-content button:last-child:hover {
  background-color: #c53030;
}
</style>
