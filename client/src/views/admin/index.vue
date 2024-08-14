<template>
    <div class="flex">
      <div class="hidden md:block w-1/5 bg-gray-800 min-h-[600px]">
        <div class="text-white p-4">
          <h2 class="text-xl font-bold">Trang chủ Admin</h2>
          <div class="mt-2">
            <button @click="logout">Logout</button>
          </div>
        </div>
        <div class="my-4">
          <p
            :class="`block text-gray-300 hover:bg-gray-700 hover:cursor-pointer py-2 px-4 ${activeTab === 'fields' ? 'bg-gray-700' : ''}`"
            @click="activeTab = 'fields'"
          >
            Quản lý sân bóng
          </p>
          <p
            :class="`block text-gray-300 hover:bg-gray-700 hover:cursor-pointer py-2 px-4 ${activeTab === 'fieldsBooked' ? 'bg-gray-700' : ''}`"
            @click="activeTab = 'fieldsBooked'"
          >
            Sân đang được đặt
          </p>
          <p
            :class="`block text-gray-300 hover:bg-gray-700 hover:cursor-pointer py-2 px-4 ${activeTab === 'users' ? 'bg-gray-700' : ''}`"
            @click="activeTab = 'users'"
          >
            Quản lý người dùng
          </p>
          <p
            :class="`block text-gray-300 hover:bg-gray-700 hover:cursor-pointer py-2 px-4 ${activeTab === 'products' ? 'bg-gray-700' : ''}`"
            @click="activeTab = 'products'"
          >
            Quản lý sản phẩm
          </p>
          <p
            :class="`block text-gray-300 hover:bg-gray-700 hover:cursor-pointer py-2 px-4 ${activeTab === 'revenue' ? 'bg-gray-700' : ''}`"
            @click="activeTab = 'revenue'"
          >
            Doanh thu
          </p>
        </div>
      </div>
      <div class="sm:w-full md:w-4/5 bg-white p-4">
        <field-management v-if="activeTab === 'fields'" />
        <field-booked v-else-if="activeTab === 'fieldsBooked'" />
        <user-management v-else-if="activeTab === 'users'" />
        <product-management v-else-if="activeTab === 'products'" />
        <revenue v-else />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useMessage } from 'naive-ui';
  
  import FieldManagement from './components/field/FieldManagement.vue';
  import FieldBooked from './components/booking/BookingManagement.vue';
  import UserManagement from './components/user/UserManagement.vue';
  import ProductManagement from './components/product/ProductManagement.vue';
  import Revenue from './components/revenue/Revenue.vue';
  
  const router = useRouter();
  const message = useMessage();
  const activeTab = ref('fields');
  
  const logout = () => {
    sessionStorage.removeItem('userData');
    const userChangeEvent = new Event('user-data-change');
    window.dispatchEvent(userChangeEvent);
    message.success('Đăng xuất thành công');
    router.push('/admin');
  };
  </script>
  