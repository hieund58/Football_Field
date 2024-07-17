<template>
  <div
    class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <!-- <img class="mx-auto h-10 w-auto" src="../../assets/images/logoweb.png" alt="Your Company" style="height: 200px;width: 200px;" /> -->
      <h2
        class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
        style="color: #fa4516"
      >
        Đăng Ký
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <n-form ref="formRef" :model="user" :rules="rules">
        <n-form-item path="email" label="Email">
          <n-input v-model:value="user.email" @keydown.enter.prevent />
        </n-form-item>
        <n-form-item path="password" label="Mật Khẩu">
          <n-input
            v-model:value="user.password"
            type="password"
            show-password-on="click"
            @input="handlePasswordInput"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item
          ref="rPasswordFormItemRef"
          first
          path="passwordConfirm"
          label="Xác nhận mật khẩu"
        >
          <n-input
            v-model:value="user.passwordConfirm"
            :disabled="!user.password"
            type="password"
            show-password-on="click"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item path="role" label="Vai trò">
          <n-select v-model:value="user.role" :options="roleOptions" />
        </n-form-item>
        <n-button type="info" block @click="registerUser"> Đăng ký </n-button>
      </n-form>

      <p class="mt-4 text-center text-sm text-gray-500" style="color: #fa4516">
        Nếu Bạn Đã Có Tài Khoản?
        <router-link
          to="/login"
          class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >Đăng Nhập Tại Đây</router-link
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useLoadingBar, useMessage } from "naive-ui";

const router = useRouter();
const loadingBar = useLoadingBar();
const message = useMessage();

const rPasswordFormItemRef = ref(null);
const formRef = ref(null);
const user = ref({
  email: "",
  password: "",
  passwordConfirm: "",
  role: "user", // Mặc định là người dùng
});

const roleOptions = [
  { label: "Người dùng", value: "user" },
  { label: "Người quản lý", value: "admin" },
];

const rules = {
  email: [
    {
      required: true,
      message: "Email bắt buộc",
      trigger: ["input", "blur"],
    },
  ],
  password: [
    {
      required: true,
      message: "Mật khẩu bắt buộc",
      trigger: ["input", "blur"],
    },
  ],
  passwordConfirm: [
    {
      required: true,
      message: "Xác nhận mật khẩu bắt buộc",
      trigger: ["input", "blur"],
    },
    {
      validator: validatePasswordSame,
      message: "Mật khẩu và xác nhận mật khẩu không giống nhau",
      trigger: ["input", "blur", "password-input"],
    },
  ],
};

function validatePasswordSame(_rule, value) {
  return value === user.value.password;
}

function handlePasswordInput() {
  if (user.value.passwordConfirm) {
    rPasswordFormItemRef.value?.validate({ trigger: "password-input" });
  }
}

const registerUser = async () => {
  formRef.value
    ?.validate((errors) => {
      if (errors) return;
      loadingBar.start();
      // Tạo một đối tượng newUser để đăng ký
      const newUser = {
        email: user.value.email,
        password: user.value.password,
        role: user.value.role,
      };

      // Gửi yêu cầu đăng ký đến backend
      axios
        .post("http://localhost:5000/api/signup", newUser)
        .then((response) => {
          // Xử lý phản hồi từ máy chủ
          message.success(response.data.message);
          if (response.data.success) {
            router.push("/login"); // Chuyển hướng đến trang đăng nhập nếu đăng ký thành công
          }
        })
        .catch((error) => {
          // Xử lý lỗi nếu có
          console.error("Lỗi đăng ký:", error);
          message.error(error?.response?.data?.message || "Có lỗi đăng ký");
        })
        .finally(() => {
          loadingBar.finish();
        });
    })
    .catch(() => {});
};
</script>
