<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto" src="../../assets/images/logoweb.png" alt="Your Company" style="height: 200px;width: 200px;" />
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900" style="color: #FA4516;">Đăng Ký</h2>
      </div>
  
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" action="#" method="POST" @submit.prevent="registerUser">
          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Tài Khoản</label>
            <div class="mt-2">
              <input
                v-model="user.email"
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required=""
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
  
          <div>
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Mật Khẩu</label>
            <div class="mt-2">
              <input
                v-model="user.password"
                id="password"
                name="password"
                type="password"
                autocomplete="new-password"
                required=""
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
        <label for="password_confirmation" class="block text-sm font-medium leading-6 text-gray-900">Xác Nhận Mật Khẩu</label>
        <div class="mt-2">
          <input
            v-model="user.password_confirmation"
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            autocomplete="new-password"
            required=""
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <label for="role" class="block text-sm font-medium leading-6 text-gray-900">Vai Trò</label>
        <div class="mt-2">
          <select
            v-model="user.role"
            id="role"
            name="role"
            required=""
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="Người dùng">Người Dùng</option>
            <option value="Người Quản Lý">Người Quản Lý</option>
          </select>
        </div>
      </div>

          <div>
            <button
              type="submit" 
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Đăng Ký
            </button>
          </div>
        </form>
  
        <p class="mt-10 text-center text-sm text-gray-500" style="color: #FA4516;">
          Nếu Bạn Đã Có Tài Khoản ?
          {{ ' ' }}
          <!-- <a href="#" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500" >Đăng Nhập Tại Đây</a> -->
          <router-link to="/login" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Đăng Nhập Tại Đây</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const user = ref({
  email: '',
  password: '',
  password_confirmation: '',
  role: 'Người dùng', // Mặc định là người dùng
});

const router = useRouter();

const registerUser = () => {
  // Kiểm tra xác thực đơn giản ở đây, ví dụ: kiểm tra mật khẩu khớp
  if (user.value.password !== user.value.password_confirmation) {
    alert('Mật khẩu không khớp.');
    return;
  }

  // Tạo một đối tượng newUser để đăng ký
  const newUser = {
    email: user.value.email,
    password: user.value.password,
    role: user.value.role,
  };

  // Gửi yêu cầu đăng ký đến backend
  axios
    .post('http://localhost:5000/api/signup', newUser)
    .then((response) => {
      // Xử lý phản hồi từ máy chủ
      alert(response.data.message);
      if (response.data.success) {
        router.push('/login'); // Chuyển hướng đến trang đăng nhập nếu đăng ký thành công
      }
    })
    .catch((error) => {
      // Xử lý lỗi nếu có
      console.error('Lỗi đăng ký:', error);
    });
};
</script>
  