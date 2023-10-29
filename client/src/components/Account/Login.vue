<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-10 w-auto"
        src="../../assets/images/logoweb.png"
        alt="Your Company"
        style="height: 200px; width: 200px;"
      />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Đăng Nhập</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="#" method="POST" @submit.prevent="loginUser">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Tài Khoản</label>
          <div class="mt-2">
            <input
              v-model="user.email"
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Mật Khẩu</label>
            <div class="text-sm">
              <a
                href="#"
                class="font-semibold text-indigo-600 hover:text-indigo-500;color:"
                style="color: #FA4516;"
              >
                Quên Mật Khẩu ?
              </a>
            </div>
          </div>
          <div class="mt-2">
            <input
              v-model="user.password"
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Đăng Nhập
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Nếu Bạn Chưa Có Tài Khoản ? {{ ' ' }}
        <router-link to="/register" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >Đăng Ký Tại Đây</router-link
        >
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
});
const router = useRouter();
const loginUser = () => {
  // Tạo một đối tượng user để đăng nhập
  const loginUser = {
    email: user.value.email,
    password: user.value.password,
  };
  // Gửi yêu cầu đăng nhập đến backend
  axios
    .post('http://localhost:5000/api/login', loginUser)
    .then((response) => {
      if (response.status === 200) {
        // Lưu token và thông tin người dùng vào sessionStorage
        sessionStorage.setItem('userToken', response.data.token); // Lưu token trong sessionStorage
        sessionStorage.setItem('userData', JSON.stringify(response.data.user)); // Lưu thông tin người dùng trong sessionStorage
        console.log(response.data.user);
        const loginSuccessEvent = new Event('login-success');
        window.dispatchEvent(loginSuccessEvent);
        // Chuyển hướng đến trang sau khi đăng nhập thành công
        router.push('/home');
      } else {
        alert(response.data.message); // Xử lý thông báo lỗi nếu cần
      }
    })
    .catch((error) => {
      // Xử lý lỗi nếu có
      console.error('Đăng nhập thất bại:', error);
    });
};

</script>

<style scoped>
.mt-10 {
  color: #FA4516;
}
</style>
