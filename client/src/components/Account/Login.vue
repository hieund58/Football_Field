<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto" src="../../assets/images/logoweb.png" alt="Your Company" style="height: 200px;width: 200px;"/>
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900" >Đăng Nhập</h2>
      </div>
  
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" action="#" method="POST" @submit.prevent="loginUser">
          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Tài Khoản</label>
            <div class="mt-2">
              <input id="email" name="email" type="email" autocomplete="email" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
          </div>
  
          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Mật Khẩu</label>
              <div class="text-sm">
                <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500;color:" style="color: #FA4516;">Quên Mật Khẩu ?</a>
              </div>
            </div>
            <div class="mt-2">
              <input id="password" name="password" type="password" autocomplete="current-password"  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
          </div>
  
          <div>
            <button  type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" >Sign in</button>
          </div>
        </form>
  
        <p class="mt-10 text-center text-sm text-gray-500">
          Nếu Bạn Chưa Có Tài Khoản ?
          {{ ' ' }}
          <!-- <a href="#" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Đăng Ký Tại Đây</a> -->
          <router-link to="/register" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Đăng Ký Tại Đây</router-link>
        </p>
      </div>
    </div>
  </template>
  <script setup>
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const user = ref({
    email: '',
    password: '',
  });
  
  const loginUser = () => {
    // Đây là ví dụ tạo một đối tượng user mô phỏng dữ liệu đăng nhập thành công.
        const successfulUser = ref({
            email: '',
            password: '',
        });
    if (
      user.value.email === successfulUser.email &&
      user.value.password === successfulUser.password
    ) {
      // Chuyển hướng đến trang /home sau khi đăng nhập thành công.
      const router = useRouter();
      router.push('/bookingball'); 
    } else {
      console.log('Đăng nhập thất bại. Vui lòng kiểm tra tài khoản và mật khẩu.');
    }
  };
  </script>
  
  <style scoped>
  .mt-10{
    color: #FA4516;
  }
  </style>