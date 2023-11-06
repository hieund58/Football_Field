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
        <router-link to="/revenue" class="block text-gray-300 hover.bg-gray-700 py-2 px-4">
          Doanh Thu
        </router-link>
      </div>
    </div>
    <div class="w-4/5 bg-white p-4">
      <div class="fields-container">
        <h2>Bảng thống kê các sân bóng</h2>
        <table>
          <thead>
            <tr>
              <th>Tên sân</th>
              <th>Số người</th>
              <th>Mô tả</th>
              <th>Hình ảnh sân</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="field in fields" :key="field._id">
              <td>{{ field.name }}</td>
              <td>{{ field.people }}</td>
              <td>{{ field.description && field.description.facilities }}</td>

              <td>
                <img :src="field.imageSrc" alt="Hình ảnh sân" style="max-width: 100px" />
              </td>
            </tr>
          </tbody>
        </table>
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
      fields: [],
    };
  },
  created() {
    this.fetchFields();
  },
  methods: {
    async fetchFields() {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        this.fields = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    logout() {
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('userLogin');
      this.$router.push('/admin');
    },
  },
};
</script>

<style>
.fields-container {
  margin-top: 50px;
  margin-bottom: 100px;
}

.fields-container h2 {
  margin-bottom: 20px;
  font-size: 30px;
}

.fields-container table {
  width: 100%;
  border-collapse: collapse;
}

.fields-container th,
.fields-container td {
  border: 1px solid #dddddd;
  padding: 8px;
  text-align: left;
}

.fields-container tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>
