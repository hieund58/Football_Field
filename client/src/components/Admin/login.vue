<template>
  <div v-if="!isLoggedIn" class="login-container">
   <div class="login-container">
     <h2>Đăng nhập</h2>
     <input type="text" v-model="username" placeholder="Username" />
     <input type="password" v-model="password" placeholder="Password" />
     <button @click="login">Đăng nhập</button>
   </div>
   </div>
  <div v-else class="login-container">
     <h2>Bạn đã đăng nhập!</h2>
     <p>Xin chào, {{ getUsernameFromSession }}</p>
     <router-link to="/fields" class="block py-2 px-4">
           Truy cập trang chủ admin
         </router-link>
     <!-- Nút logout -->
   </div>
 
 </template>
 
 <script>
 
   
 export default {
   data() {
     return {
       username: '',
       password: ''
     };
   },
   
   methods: {
     login() {
       if (this.username === 'admin'&& this.password === 'admin') {
 
         sessionStorage.setItem('isLoggedIn', 'true');
         sessionStorage.setItem('userLogin',this.username);
 
         // Lưu thông tin đăng nhập vào session storage
         this.$router.push('/fields');
       } else {
         alert('Sai thông tin đăng nhập!');
       }
     }
   },
  computed: {
     getUsernameFromSession() {
       return sessionStorage.getItem('isLoggedIn') === 'true' ? 'Admin' : '';
       // Trả về tên người dùng từ session storage nếu đã đăng nhập, nếu không trả về chuỗi rỗng.
     }
   },
   created() {
     this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
     // Kiểm tra xem người dùng đã đăng nhập hay chưa khi tải trang.
   }
 };
 </script>
 
 <style>
 .login-container {
   display: flex;
   flex-direction: column;
   align-items: center;
   margin-top: 100px;
   margin-bottom: 100px;
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
   background-color: #4CAF50;
   color: white;
   border: none;
   border-radius: 5px;
   cursor: pointer;
 }
 </style>