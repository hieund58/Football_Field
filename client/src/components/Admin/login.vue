<template>
  <div>
    <div v-if="!adminLoggedIn" class="login-container">
      <h2>Đăng nhập admin</h2>
      <input type="text" v-model="loginData.email" placeholder="Username" />
      <input type="password" v-model="loginData.password" placeholder="Password" />
      <button @click="login">Đăng nhập</button>
    </div>
    <div v-else class="login-container">
      <h2>Bạn đã đăng nhập!</h2>
      <p>Xin chào, {{ getUsernameFromSession }}</p>
      <router-link to="/admin/home" class="block py-2 px-4 text-blue-500 underline">Truy cập trang chủ admin</router-link>
      <!-- Nút logout -->
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLoadingBar, useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';

const loadingBar = useLoadingBar();
const message = useMessage();
const router = useRouter();

const loginData = ref({
  email: '',
  password: ''
});

async function login() {
  sessionStorage.removeItem('userData');
  sessionStorage.removeItem('userToken');

  loadingBar.start();
  try {
    const response = await axios.post('http://localhost:5000/api/login/admin', loginData.value);
    message.success('Đăng nhập admin thành công');
    sessionStorage.setItem('userToken', response.data.token); // Lưu token trong sessionStorage
    sessionStorage.setItem('userData', JSON.stringify(response.data.user)); // Lưu thông tin người dùng trong sessionStorage
    const userChangeEvent = new Event('user-data-change');
    window.dispatchEvent(userChangeEvent);
    router.push('/admin/home');
  } catch (error) {
    message.error(error?.response?.data?.message || 'Đăng nhập thất bại');
  } finally {
    loadingBar.finish();
  }
}
const adminLoggedIn = computed(() => {
  if (!sessionStorage.getItem('userData')) return false;
  const userData = JSON.parse(sessionStorage.getItem('userData'));
  return userData?.role === 'admin';
});

const getUsernameFromSession = computed(() => (adminLoggedIn.value ? 'Admin' : ''));

function onKeyUpEnter(event) {
  if (event?.keyCode === 13) {
    login();
  }
}

onMounted(() => {
  window.addEventListener('keyup', onKeyUpEnter, true);
});

onBeforeUnmount(() => {
  window.removeEventListener('keyup', onKeyUpEnter, true);
});
</script>

<style>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  margin: auto;
}
.login-container h2 {
  margin-bottom: 10px;
  padding: 10px;
  font-size: 20px;
  font-weight: bold;
}
.login-container input {
  margin-bottom: 20px;
  padding: 10px;
  width: 200px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.login-container button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
