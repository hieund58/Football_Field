<template>
  <div class="flex">
    <div class="w-1/5 bg-gray-800 h-screen">
      <div class="text-white p-4">
        <h2 class="text-xl font-bold">Trang chủ Admin</h2>
        <div class="user-info">
          <p>User: {{ getUsernameFromSession }}</p>
          <button @click="logout">Logout</button>
        </div>
      </div>
      <div class="my-4">
        <router-link
          to="/fields"
          class="block text-gray-300 hover:bg-gray-700 py-2 px-4"
        >
          Thống kê các sân bóng
        </router-link>
        <router-link
          to="/bookingDetail"
          class="block text-gray-300 hover:bg-gray-700 py-2 px-4"
        >
          Sân đang được đặt
        </router-link>
        <router-link
          to="/UserManager"
          class="block text-gray-300 hover:bg-gray-700 py-2 px-4"
        >
          Quản lý người dùng
        </router-link>
        <router-link
          to="/revenue"
          class="block text-gray-300 hover:bg-gray-700 py-2 px-4"
        >
          Doanh Thu
        </router-link>
      </div>
    </div>
    <div class="w-4/5 bg-white p-4">
      <div class="fields-container">
        <h2>Thống kê người dùng</h2>
        <button class="btn btn-primary mb-3" @click="openDialog">
          Thêm người dùng
        </button>

        <table>
          <thead>
            <tr>
              <th>Tên người dùng</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>More</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="index">
              <td>{{ user.fullName }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <button class="edit btn" @click="editUser(user)">Sửa</button>
                <button class="del btn" @click="deleteUser(user._id)">
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="showDialog" class="dialog-overlay" @click="closeDialog">
        <div class="dialog-content" @click.stop>
          <form @submit.prevent="addUser" class="dialog-form">
            <label for="fullName">Full Name:</label>
            <input type="text" v-model="newUser.fullName" required />

            <label for="phone">Phone:</label>
            <input type="text" v-model="newUser.phone" required />

            <label for="email">Email:</label>
            <input type="email" v-model="newUser.email" required />

            <label for="role">Role:</label>
            <input type="text" v-model="newUser.role" required />

            <div class="dialog-btn">
              <button type="submit" class="btn btn-primary">Thêm</button>
              <button
                type="cancel"
                class="btn btn-cancel"
                @click="cancelAddUser"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      users: [],
      showDialog: false,
      newUser: {
        fullName: "",
        phone: "",
        email: "",
        role: "",
      },
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      axios
        .get("http://localhost:5000/api/users")
        .then((response) => {
          this.users = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    editUser(user) {
      this.$router.push({ name: "/EditUser/", params: { id: user._id } });
    },
    async deleteUser(userId) {
      try {
        const confirmed = window.confirm(
          "Are you sure you want to delete this user?",
        );

        if (!confirmed) {
          return;
        }

        await axios.delete(`http://localhost:5000/api/users/${userId}`);
        this.getUsers();
      } catch (error) {
        console.error(error);
      }
    },
    openDialog() {
      this.showDialog = true;
    },
    closeDialog() {
      this.showDialog = false;
      this.resetNewUser();
    },
    addUser() {
      axios
        .post("http://localhost:5000/api/users", this.newUser)
        .then((response) => {
          console.log(response.data);
          this.closeDialog();
          this.getUsers();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    resetNewUser() {
      this.newUser = {
        fullName: "",
        phone: "",
        email: "",
        role: "",
      };
    },
    cancelAddUser() {
      this.closeDialog();
    },
  },
};
</script>

<style scoped>
.fields-container {
  margin-top: 50px;
  margin-bottom: 100px;
}

.fields-container h2 {
  margin-bottom: 20px;
  font-size: 30px;
}

.fields-container table {
  width: 100%;
  border-collapse: collapse;
}

.fields-container th,
.fields-container td {
  border: 1px solid #dddddd;
  padding: 12px;
  text-align: left;
}

.fields-container th {
  background-color: #f0f0f0;
}

.fields-container tr:nth-child(even) {
  background-color: #f9f9f9;
}

.btn {
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #3490dc;
  color: #ffffff;
  border: 1px solid #3490dc;
}

.btn-primary:hover {
  background-color: #2779bd;
}

.btn-cancel {
  background-color: #e53e3e;
  color: #ffffff;
  border: 1px solid #e53e3e;
}

.btn-cancel:hover {
  background-color: #c53030;
}

.dialog-form label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.dialog-form input {
  width: calc(100% - 16px);
  padding: 10px;
  margin-bottom: 16px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.dialog-btn {
  display: flex;
  justify-content: space-between;
}

.dialog-btn button {
  padding: 10px 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dialog-btn button[type="cancel"] {
  background-color: #e53e3e;
  color: #ffffff;
  border: 1px solid #e53e3e;
}

.dialog-btn button[type="cancel"]:hover {
  background-color: #c53030;
}

.dialog-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.dialog-content {
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
</style>
