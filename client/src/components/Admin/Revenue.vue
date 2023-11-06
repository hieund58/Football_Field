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
      <!-- hiển thị thông tin doanh thu -->
  </div>

      
      <router-view></router-view>
    </div>
  </div>
</template>
  


<script>
export default {
     computed: {
 getUsernameFromSession() {
      return sessionStorage.getItem('isLoggedIn') === 'true' ? sessionStorage.getItem('userLogin') : 'Chưa đăng nhập';
      // Trả về tên người dùng từ session storage nếu đã đăng nhập, nếu không trả về chuỗi rỗng.
    }
    },
     methods: {
        logout() {
              

            sessionStorage.removeItem('isLoggedIn'); 
            sessionStorage.removeItem('userLogin');
            this.$router.push('/admin');    

    }
     }
  // lấy dữ liệu từ MongoDB
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