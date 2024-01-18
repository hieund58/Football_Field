<template>
  <div class="flex">
    <div class="w-1/5 bg-gray-800 h-screen">
      <div class="text-white p-4">
        <h2 class="text-xl font-bold">Trang chủ Admin</h2>
        <div class="user-info">
          <p> User: {{ getUsernameFromSession }} </p>
          <button @click="logout">Logout</button>
        </div>
      </div>
      <div class="my-4">
        <router-link to="/fields" class="block text-gray-300 hover:bg-gray-700 py-2 px-4">
          Thống kê các sân bóng
        </router-link>
        <router-link to="/bookingDetail" class="block text-gray-300 hover.bg-gray-700 py-2 px-4">
          Sân đang được đặt
        </router-link>
        <router-link to="/UserManager" class="block text-gray-300 hover:bg-gray-700 py-2 px-4">
          Trạng thái người dùng
        </router-link>
        <router-link to="/revenue" class="block text-gray-300 hover:bg-gray-700 py-2 px-4">
          Doanh Thu
        </router-link>
      </div>
    </div>
    <div class="w-4/5 bg-white p-4">
      <!-- Nội dung trang chính -->
      <div class="revenue-container">
        <h2>Thống kê báo cáo thu nhập của sân trong 1 tháng</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr>
                <th class="px-6 py-3 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Tên sân bóng</th>
                <th class="px-6 py-3 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Xem báo cáo doanh thu</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="name in uniqueUserList" :key="name">
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{{ name }}</td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  <router-link
  :to="{ name: 'FieldRevenue', params: { name: name } }"
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
>
  Xem
</router-link>

                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  computed: {
    getUsernameFromSession() {
      return sessionStorage.getItem('isLoggedIn') === 'true' ? sessionStorage.getItem('userLogin') : 'Chưa đăng nhập';
    },
  },
  data() {
    return {
      userList: [],
    };
  },
  created() {
    this.name = this.$route.params.name; // Lấy tên sân bóng từ tham số định tuyến
    this.fetchUserList();
  },
  methods: {
    async fetchUserList() {
      try {
        const response = await axios.get('http://localhost:5000/api/process-payment');
        this.userList = response.data;
      } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
      }
    },
    viewUserRevenue(name) {
      // Điều hướng đến trang xem báo cáo doanh thu của từng sân
      this.$router.push({ name_field: 'UserRevenue', params: { name: name } });
    },
  },
  computed: {
    uniqueUserList() {
      // Dùng Set để lọc các username duy nhất
      const names = this.userList.map(user => user.name);
      return [...new Set(names)];
    },
  },
  logout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userLogin');
    this.$router.push('/admin');
  },
};
</script>

<style>
.revenue-container {
  margin-top: 50px;
  margin-bottom: 100px;
}
.revenue-container h2 {
  margin-bottom: 20px;
  font-size: 30px;
}
</style>
