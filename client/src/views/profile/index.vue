<template>
  <div class="flex flex-row w-full !pt-[80px]">
    <div class="p-2 rounded-lg bg-white  border-solid border-[2px] border-gray-200 m-[10px] !ml-[15px] !mr-[5px]">
      <div class="menu-up">
        <img :src="userImage.url" alt="" />
        <h1>{{ userEmail }}</h1>
        <small>{{ userRole }}</small>
        <!-- Hiển thị role từ sessionStorage -->
      </div>
      <div class="menu-down">
        <ul>
          <li @click="selectedTab = 'account'" :class="{ active: selectedTab === 'account' }">
            <font-awesome-icon :icon="['fas', 'user-pen']" class="icon" />
            Thông Tin Tài Khoản
          </li>
          <li @click="selectedTab = 'bookings'" :class="{ active: selectedTab === 'bookings' }">
            <font-awesome-icon :icon="['fas', 'futbol']" class="icon" />
            Thông Tin Sân Đã Đặt
          </li>
          <li @click="selectedTab = 'transactions'" :class="{ active: selectedTab === 'transactions' }">
            <font-awesome-icon :icon="['fas', 'file-invoice-dollar']" class="icon" />
            Lịch Sử Mua Hàng
          </li>
          <li @click="selectedTab = 'promotions'" :class="{ active: selectedTab === 'promotions' }">
            <font-awesome-icon :icon="['fas', 'tag']" class="icon" />
            Ưu Đãi Và Khuyến Mãi
          </li>
          <li @click="selectedTab = 'support'" :class="{ active: selectedTab === 'support' }">
            <font-awesome-icon :icon="['fas', 'headphones']" class="icon" />
            Hỗ Trợ
          </li>
        </ul>
      </div>
    </div>

    <div class="p-4 rounded-lg bg-white border-solid border-[2px] border-gray-200 m-[10px] !mr-[15px] w-full">
      <div v-show="selectedTab === 'account'">
        <Account />
      </div>
      <BookingInfo v-show="selectedTab === 'bookings'" />
      <StoreHistory v-show="selectedTab === 'transactions'"/>
      <div v-if="selectedTab === 'promotions'">Nội dung Ưu Đãi Và Khuyến Mãi</div>
      <div v-if="selectedTab === 'support'">Nội dung Hỗ Trợ</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import Account from './components/Account.vue';
import BookingInfo from './components/BookingInfo.vue';
import StoreHistory from './components/StoreHistory.vue'

const selectedTab = ref('account');
const userImage = ref({
  url: 'https://th.bing.com/th/id/OIP.Fogk0Q6C7GEQEdVyrbV9MwHaHa?pid=ImgDet&rs=1'
});
const userEmail = ref(''); // Biến chứa email
const userRole = ref(''); // Biến chứa role
onBeforeMount(() => {
  // Lấy giá trị email và role từ sessionStorage
  const userData = sessionStorage.getItem('userData');

  if (userData) {
    const { email, role } = JSON.parse(userData);
    userEmail.value = email;
    userRole.value = role;
  }
});
</script>

<style scoped>
.wrapper {
  /* margin: auto;
    min-height: 100%;
    width: 100%;
    padding-left: 10px;
    padding-right: 10px */
}
.menu {
  /* min-height: 100%; */
  width: 250px;
  max-width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  /* margin: 15px 10px 0 0; */
}

.content {
  /* height: 800px;
    width: auto;
    margin: 15px 10px 0 0; */
}

.menu-up {
  text-align: center;
  padding: 10px;
  border-bottom: 1px solid #8d8d8d;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.menu-up img {
  height: 100px;
  width: 100px;
  border-radius: 50%;
}

.menu-up h1 {
  font-size: large;
  font-weight: 500;
  padding: 8px;
}

.menu-up small {
  font-size: smaller;
}

.menu-down {
  padding: 10px;
  width: 100%;
  height: auto;
}

.menu-down ul li {
  padding: 10px 10px;
  font-size: large;
  cursor: pointer;
  max-width: 250px;
  white-space: nowrap; /* Ngăn nội dung xuống dòng */
}

.menu-down ul li:hover {
  background-color: aliceblue;
  border-left: 1px solid #000;
  color: #fa4516;
}

.menu-down ul li.active {
  background-color: aliceblue;
  color: #fa4516;
}

.icon {
  padding: 0px 10px;
}
</style>
