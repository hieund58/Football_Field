<template>
  <div>
    <div class="content">
      <h1 class="text-lg font-bold pb-5">Thông Tin Tài Khoản</h1>
      <n-grid cols="1 m:5" responsive="screen" x-gap="10" y-gap="10" class="text-base">
        <n-gi span="1">Email:</n-gi>
        <n-gi span="4">
          {{ user ? user.email : '' }}
        </n-gi>

        <n-gi span="1">Họ Tên:</n-gi>
        <n-gi span="4">
          <div v-if="!isEditing">{{ userInfo ? userInfo.fullName : '' }}</div>
          <input v-else v-model="userInfo.fullName" placeholder="Họ Tên" class="edit-form" />

        </n-gi>

        <n-gi span="1">Số Điện Thoại:</n-gi>
        <n-gi span="4">
          <div v-if="!isEditing">{{ userInfo ? userInfo.phone : '' }}</div>
          <input v-else v-model="userInfo.phone" placeholder="Số Điện Thoại" class="edit-form" />
        </n-gi>
      </n-grid>
      <div v-if="!isEditing" class="pt-[20px]">
        <button @click="startEditing" type="button" class="button">
          <font-awesome-icon :icon="['fas', 'file-pen']" class="edit-save-icon" />
          Edit
        </button>
      </div>
      
      <div v-else class="pt-[20px]">
        <button @click="saveEditing" type="button" class="button">
          <font-awesome-icon icon="floppy-disk" class="edit-save-icon" />
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isEditing: false,
      user: {},
      userInfo: {
        email: '',
        fullName: '',
        phone: ''
      }
    };
  },
  methods: {
    async fetchUserInfo() {
      // Lấy thông tin người dùng từ sessionStorage
      let userData = sessionStorage.getItem('userData');

      if (!userData) {
        // Nếu userInfo chưa tồn tại, tạo một đối tượng mặc định
        const defaultUserInfo = {
          email: '',
          fullName: '',
          phone: ''
        };

        // Lưu đối tượng userInfo vào sessionStorage
        userData = JSON.stringify(defaultUserInfo);
        sessionStorage.setItem('userData', userData);
      }

      // Gán giá trị từ sessionStorage vào userInfo
      this.user = JSON.parse(userData);
      this.userInfo.fullName = this.user.fullName;
      this.userInfo.phone = this.user.phone;
      this.userInfo.email = this.user.email;
    },

    startEditing() {
      this.isEditing = true;
    },

    async saveEditing() {
      try {
        // Lưu thông tin chỉnh sửa vào sessionStorage
        this.user.fullName = this.userInfo.fullName;
        this.user.phone = this.userInfo.phone;

        // Lưu thông tin người dùng trong sessionStorage
        sessionStorage.setItem('userData', JSON.stringify(this.user));

        // Chuẩn bị dữ liệu để gửi lên máy chủ
        const data = {
          email: this.userInfo.email,
          fullName: this.userInfo.fullName,
          phone: this.userInfo.phone
        };

        // Gửi yêu cầu PUT đến API
        const response = await axios.put('http://localhost:5000/api/userinfo', data);

        if (response.status === 200) {
          this.isEditing = false; // Kết thúc chế độ chỉnh sửa
        } else {
          console.error('Lỗi khi cập nhật thông tin người dùng.');
        }
      } catch (error) {
        console.error(error);
      }
    }
  },
  created() {
    this.fetchUserInfo();
  }
};
</script>

<style scoped>
.button {
  border: 1px solid #ccc;
  padding: 5px 40px;
  border-radius: 5px;
  background-color: #fff;
  color: #000;
}

.button:hover {
  background-color: #fa4516;
  color: #fff;
}

.edit-form {
  border: 1px solid #ccc;
  padding: 0px 10px;
  border-radius: 5px;
  width: 350px;
}
.edit-form:focus {
  outline-color: #ccc !important;
  border: 1px solid #ccc !important;
}

.edit-save-icon {
  color: #000;
}
</style>
