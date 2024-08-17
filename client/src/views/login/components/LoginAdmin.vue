<template>
  <div>
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-[#FA4516]">Đăng Nhập Admin</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div class="mb-2 ml-1">
        <span style="font-size: 14px">Tên tài khoản</span>
        <span style="color: #d03050">&nbsp;*</span>
      </div>

      <n-form ref="formRef" :model="user" :rules="rules">
        <n-form-item path="email" label="Email" :show-label="false">
          <n-input v-model:value="user.email" placeholder="Email" @keydown.enter.prevent />
        </n-form-item>

          <div class="mb-2 ml-1">
            <span style="font-size: 14px">Mật khẩu</span>
            <span style="color: #d03050">&nbsp;*</span>
          </div>

        <n-form-item path="password" :show-label="false">
          <n-input v-model:value="user.password" type="password" placeholder="Mật khẩu" show-password-on="click" />
        </n-form-item>

        <n-button type="info" block @click="handleLogin">Đăng nhập</n-button>
      </n-form>

      <div class="text-center mt-3">
      <div class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 hover:cursor-pointer" @click="emits('go-user')">
          Đăng Nhập User
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useLoadingBar, useMessage } from 'naive-ui';

const emits = defineEmits(['go-user'])

const router = useRouter();
const loadingBar = useLoadingBar();
const message = useMessage();

const formRef = ref(null);
const user = ref({
  email: '',
  password: ''
});

const rules = {
  email: [
    {
      required: true,
      message: 'Tên tài khoản bắt buộc',
      trigger: ['input', 'blur']
    }
  ],
  password: [
    {
      required: true,
      message: 'Mật khẩu bắt buộc',
      trigger: ['input', 'blur']
    }
  ]
};
const handleLogin = () => {
  formRef.value
    ?.validate(errors => {
      if (errors) return;
      loadingBar.start();
      // Tạo một đối tượng user để đăng nhập
      const loginUser = {
        email: user.value.email,
        password: user.value.password
      };
      // Gửi yêu cầu đăng nhập đến backend
      axios
        .post('http://localhost:5000/api/login/admin', loginUser)
        .then(response => {
          if (response.status === 200) {
            message.success('Đăng nhập thành công');
            // Lưu token và thông tin người dùng vào sessionStorage
            sessionStorage.setItem('userToken', response.data.token); // Lưu token trong sessionStorage
            sessionStorage.setItem('userData', JSON.stringify(response.data.user)); // Lưu thông tin người dùng trong sessionStorage
            const userChangeEvent = new Event('user-data-change');
            window.dispatchEvent(userChangeEvent);
            // Chuyển hướng đến trang sau khi đăng nhập thành công
            loadingBar.finish();
            router.push('/admin/home');
          } else {
            message.error(response.data.message);
          }
        })
        .catch(error => {
          // Xử lý lỗi nếu có
          console.error('Đăng nhập thất bại:', error);
          message.error(error?.response?.data?.message || 'Đăng nhập thất bại');
        })
        .finally(() => {
          loadingBar.finish();
        });
    })
    .catch(() => {});
};

function onKeyUpEnter(event) {
  if (event?.keyCode === 13) {
    handleLogin();
  }
}

onMounted(() => {
  window.addEventListener('keyup', onKeyUpEnter, true);
});

onBeforeUnmount(() => {
  window.removeEventListener('keyup', onKeyUpEnter, true);
});
</script>
