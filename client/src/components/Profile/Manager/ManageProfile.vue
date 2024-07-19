<template>
  <div class="wrapper">
    <n-grid cols="6" item-responsive responsive="screen">
      <n-gi span="6 s:6 m:1" class="menu">
        <div class="menu-up">
          <img :src="userImage.url" alt="" />
          <h1>{{ userEmail }}</h1>
          <small>{{ userRole }}</small>
        </div>
        <div class="menu-down">
          <ul>
            <li title="Thông Tin Tài Khoản" @click="selectedTab = 'account'" :class="{ active: selectedTab === 'account' }">
              <font-awesome-icon :icon="['fas', 'user-pen']" class="icon" />
              Thông Tin Tài Khoản
            </li>
            <li title="Quản Lý Sân" @click="selectedTab = 'bookings'" :class="{ active: selectedTab === 'bookings' }">
              <font-awesome-icon :icon="['fas', 'futbol']" class="icon" />
              Quản Lý Sân
            </li>
            <li title="Lịch Sử Giao Dịch" @click="selectedTab = 'transactions'" :class="{ active: selectedTab === 'transactions' }">
              <font-awesome-icon :icon="['fas', 'file-invoice-dollar']" class="icon" />
              Lịch Sử Giao Dịch
            </li>
            <li title="Ưu Đãi Và Khuyến Mãi" @click="selectedTab = 'promotions'" :class="{ active: selectedTab === 'promotions' }">
              <font-awesome-icon :icon="['fas', 'tag']" class="icon" />
              Ưu Đãi Và Khuyến Mãi
            </li>
            <li title="Hỗ Trợ" @click="selectedTab = 'support'" :class="{ active: selectedTab === 'support' }">
              <font-awesome-icon :icon="['fas', 'headphones']" class="icon" />
              Hỗ Trợ
            </li>
          </ul>
        </div>
      </n-gi>
      <n-gi span="6 s:6 m:5" class="content">
        <div v-if="selectedTab === 'account'">
          <Account />
        </div>
        <div v-if="selectedTab === 'bookings'">
          <field-management />
        </div>
        <div v-if="selectedTab === 'transactions'">Nội dung Lịch Sử Giao Dịch</div>
        <div v-if="selectedTab === 'promotions'">Nội dung Ưu Đãi Và Khuyến Mãi</div>
        <div v-if="selectedTab === 'support'">Nội dung Hỗ Trợ</div>
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import Account from './Account.vue';
import FieldManagement from './FieldManagement.vue';
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

<style scoped lang="scss">
.wrapper {
  margin: auto;
  max-width: 100%;
  margin-top: 5px;
  margin-bottom: 10px;
}

.menu {
  min-height: 500px;
  // min-width: 250px;
  // max-width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  margin-left: 5px
}

.content {
  /* height: 1000px; */
  width: auto;
  margin-left: 10px;
}

.menu-up {
  text-align: center;
  padding: 10px;
  border-bottom: 1px solid #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  img {
    height: 100px;
    width: 100px;
    border-radius: 50%;
  }

  h1 {
    font-size: large;
    font-weight: 500;
    word-break: break-all;
    padding: 8px;
  }

  small {
    font-size: smaller;
  }
}

.menu-down {
  width: 100%;
  height: auto;

  ul {
    text-align: left;

    li {
      padding: 10px 10px;
      cursor: pointer;
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;      /* Ngăn nội dung xuống dòng */
    }

    li:hover {
      background-color: aliceblue;
      border-left: 1px solid #000;
      color: #fa4516;
    }

    li.active {
      background-color: aliceblue;
    }
  }
}

.icon {
  padding-right: 10px;
}
</style>
