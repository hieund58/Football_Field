<template>
  <div class="wrapper">
    <div v-if="!isEditing" class="content">
      <h1>Thông Tin Tài Khoản</h1>
      <n-grid cols="4">
        <n-gi span="1">
          <ul>
            <li>Email :</li>
            <li>Họ Tên :</li>
            <li>Số Điện Thoại :</li>
          </ul>
        </n-gi>
        <n-gi span="3">
          <ul>
            <li>{{ user ? user.email : '' }}</li>
            <li>{{ userInfo.fullName }}</li>
            <li>{{ userInfo.phone }}</li>
          </ul>
        </n-gi>
      </n-grid>
      <div class="btn-edit">
        <button @click="startEditing" type="button" class="button-edit">
          <font-awesome-icon :icon="['fas', 'file-pen']" class="edit-save-icon" /> Edit
        </button>
      </div>
    </div>

    <div v-if="isEditing" class="edit-content">
      <h1>Chỉnh Sửa Thông Tin Tài Khoản</h1>
      <n-grid cols="4">
        <n-gi span="1">
          <ul class="edit-ul">
            <li>Email :</li>
            <li>Họ Tên :</li>
            <li>Số Điện Thoại :</li>
          </ul>
        </n-gi>
        <n-gi span="3">
          <ul>
            <li><input v-model="userInfo.email" placeholder="Email" class="edit-form" /></li>
            <li><input v-model="userInfo.fullName" placeholder="Họ Tên" class="edit-form" /></li>
            <li><input v-model="userInfo.phone" placeholder="Số Điện Thoại" class="edit-form" /></li>
          </ul>
        </n-gi>
      </n-grid>

      <div class="btn-save">
        <button @click="saveEditing" type="button" class="button-save">
          <font-awesome-icon icon="floppy-disk" class="edit-save-icon" />
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      isEditing: false,
      user: {}, // Thay đổi đối tượng user này để lưu thông tin người dùng
      userInfo: {
        fullName: "",
        phone: "",
      },
    };
  },
  methods: {
    async fetchUserInfo() {
      // Lấy thông tin người dùng từ sessionStorage
      const userData = sessionStorage.getItem('userData');
      if (userData) {
        this.user = JSON.parse(userData);
        this.userInfo.fullName = this.user.fullName;
        this.userInfo.phone = this.user.phone;
      } else {
        console.error('Không tìm thấy thông tin người dùng.');
      }
    },
    startEditing() {
      this.isEditing = true;
    },
    async saveEditing() {
      // Gửi thông tin chỉnh sửa lên máy chủ thông qua API
      try {
        await axios.put("http://localhost:5000/api/userinfo", {
          email: this.user.email,
          fullName: this.userInfo.fullName,
          phone: this.userInfo.phone,
        });
        this.isEditing = false;
        // Cập nhật thông tin người dùng sau khi chỉnh sửa
        this.user.fullName = this.userInfo.fullName;
        this.user.phone = this.userInfo.phone;
        // Cập nhật thông tin người dùng trong sessionStorage
        sessionStorage.setItem('userData', JSON.stringify(this.user));
      } catch (error) {
        console.error(error);
      }
    },
  },
  created() {
    this.fetchUserInfo();
  },
};
</script>

<style scoped>
.wrapper {
    height: 800px;
}

.wrapper h1 {
    font-size: 30px;
    font-weight: 500;
    padding: 20px 30px 0px 30px;
}

.content {
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    height: 550px;
}

.edit-content {
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    height: 550px;
}

.content ul {
    padding: 30px;
}

.content ul li {
    padding: 12px 30px;
    font-size: 15px;
}

.button-edit {
    border: 1px solid #ccc;
    padding: 5px 40px;
    border-radius: 5px;
    background-color: #fff;
    color: #000;
}

.button-edit:hover {
    background-color: #FA4516;
    color:#fff;

}

.btn-edit {
    display: flex;
    justify-content: center;
}


.edit-form {
    border: 1px solid #ccc;
    padding: 0px 10px;
    border-radius: 2px;
    width: 300px;
}

.button-save {
    border: 1px solid #ccc;
    padding: 5px 40px;
    border-radius: 5px;
    background-color: #fff;
    color: #000;
}

.button-save:hover {
    background-color: #FA4516;
    color: #fff ;

}

.btn-save {
    display: flex;
    justify-content: center;
    padding: 20px;
}

.edit-ul li {
    margin: 1.8px;
}
.edit-save-icon{
    color: #000 ;
}

</style>