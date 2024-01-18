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
            <li>{{ userInfo ? userInfo.fullName : '' }}</li>
            <li>{{ userInfo ? userInfo.phone : '' }}</li>
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
            <li>{{ user ? user.email : '' }}</li>
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
      user: {},
      userInfo: {
        email: "",
        fullName: "",
        phone: "",
      },
    };
  },
  methods: {
    async fetchUserInfo() {
      // Lấy thông tin người dùng từ sessionStorage
      let userData = sessionStorage.getItem("userData");

      if (!userData) {
        // Nếu userInfo chưa tồn tại, tạo một đối tượng mặc định
        const defaultUserInfo = {
          email: "",
          fullName: "",
          phone: "",
        };

        // Lưu đối tượng userInfo vào sessionStorage
        userData = JSON.stringify(defaultUserInfo);
        sessionStorage.setItem("userData", userData);
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
    sessionStorage.setItem("userData", JSON.stringify(this.user));

    // Chuẩn bị dữ liệu để gửi lên máy chủ
    const data = {
      email: this.userInfo.email,
      fullName: this.userInfo.fullName,
      phone: this.userInfo.phone,
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