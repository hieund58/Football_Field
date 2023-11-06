<template>
    <div class="flex">
      <div class="w-1/5 bg-gray-800 h-screen">
        <div class="text-white p-4">
          <h2 class="text-xl font-bold">Trang chủ Admin</h2>
          <div class="user-info">
              <p> User: {{ getUsernameFromSession }} </p>
              <button @click="logout">Logout </button>
  
          </div>
        </div>
        <div class="my-4">
          <router-link to="/fields" class="block text-gray-300 hover:bg-gray-700 py-2 px-4">
            Thống kê các sân bóng
          </router-link>
          <router-link to="/bookingDetail" class="block text-gray-300 hover:bg-gray-700 py-2 px-4">
            Sân đang được đặt
          </router-link>
          <router-link to="/revenue" class="block text-gray-300 hover:bg-gray-700 py-2 px-4">
            Doanh Thu
          </router-link>
        </div>
      </div>
      <div class="w-4/5 bg-white p-4">
        <!-- Nội dung trang chính -->
  
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
       <div class="flex justify-center items-center h-screen"></div>
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
            showConfirmationDialog: false, // Thêm thuộc tính showConfirmationDialog
      confirmationDetail: null, // Thêm thuộc tính confirmationDetail
    };
  },
  created() {
    this.bookedFields();
  },
       computed: {
   getUsernameFromSession() {
        return sessionStorage.getItem('isLoggedIn') === 'true' ? sessionStorage.getItem('userLogin') : 'Chưa đăng nhập';
        // Trả về tên người dùng từ session storage nếu đã đăng nhập, nếu không trả về chuỗi rỗng.
      },
     
      },
    methods: {
     
          logout() {
                
  
              sessionStorage.removeItem('isLoggedIn'); 
              sessionStorage.removeItem('userLogin');
              this.$router.push('/admin');    
  
      }
       },
     methods: {
      async bookedFields() {
      try {
        const response = await axios.get('http://localhost:5000/api/process-payment');
        console.log(response.data);
        this.details = response.data;
      } catch (error) {
        console.error('Lỗi khi lấy thông tin các sân đã được đặt:', error);
        return [];
      }
    },
    confirmPayment(detail) {
    // Log the _id to the console
    console.log('Clicked item _id:', detail._id);
    this.showConfirmationDialog = true;
    this.confirmationDetail = detail;
  },
  async confirmPaymentAction() {
  try {
    const _id = this.confirmationDetail._id; // Lấy _id từ bản ghi đã chọn
    const response = await axios.put(`http://localhost:5000/api/process-payment/${_id}`, {
      status: 'Đã thanh toán', // Giá trị trạng thái mới
    });

    if (response.data.message === 'Cập nhật trạng thái thanh toán thành công') {
      // Cập nhật trạng thái trong danh sách 'details' bằng cách tìm bản ghi có _id tương ứng
      const updatedDetails = this.details.map(detail => {
        if (detail._id === _id) {
          return { ...detail, status: 'Đã thanh toán' };
        }
        return detail;
      });
      this.details = updatedDetails;

      // Đóng hộp thoại xác nhận
      this.showConfirmationDialog = false;
    } else {
      console.error('Lỗi khi cập nhật trạng thái.');
    }
  } catch (error) {
    console.error('Lỗi khi gọi API:', error);
  }
}




  },
  };
  </script>
  
  <style>
@tailwind base;
@tailwind components;
@tailwind utilities;
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
