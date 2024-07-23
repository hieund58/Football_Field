<template>
  <header class="header-content fixed top-0 left-0 w-full bg-white z-50">
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-1 lg:px-3" aria-label="Global">
      <div class="flex md:flex-1 items-center">
        <a href="#" class="flex items-center -m-1.5 p-1.5">
          <img class="h-[60px] w-auto" src="../assets/images/Logo.jpg" alt="" />
          <span
            class="ml-2"
            style="
              color: rgb(235, 25, 25);
              font-size: 40px;
              font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
              font-weight: 800;
            "
          >
            Ace
          </span>
        </a>
      </div>

      <div class="flex md:hidden right-0 relative">
        <Popover as="nav">
          <PopoverButton>
            <Bars3Icon class="h-6 w-6" aria-hidden="true" />
          </PopoverButton>
          <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
          >
            <PopoverPanel
              class="absolute right-0 top-full z-10 mt-3 w-screen max-w-[120px] overflow-hidden rounded-2xl p-4 bg-white shadow-lg ring-1 ring-gray-900/5"
            >
              <!-- <div class="p-4">
                <div v-for="item in products" :key="item.name"
                  class="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50">
                  <div
                    class="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                    <component :is="item.icon" class="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                                                            aria-hidden="true" />
                  </div>
                  <div class="flex-auto">
                    <a :href="item.href" class="block font-semibold text-gray-900">
                      {{ item.name }}
                    </a>
                    <p class="mt-1 text-gray-600">{{ item.description }}</p>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                <a v-for="item in callsToAction" :key="item.name" :href="item.href"
                  class="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100">
                  {{ item.name }}
                </a>
              </div> -->
              <n-space vertical>
                <router-link to="/home" class="header-btn text-sm font-semibold leading -6 text-gray-900">
                  Trang chủ
                </router-link>
                <router-link to="/bookingball" class="header-btn text-sm font-semibold leading -6 text-gray-900">
                  Đặt sân
                </router-link>
                <router-link to="/aboutus" class="header-btn text-sm font-semibold leading-6 text-gray-900">
                  Liên hệ
                </router-link>
                <router-link to="/contact" class="header-btn text-sm font-semibold leading-6 text-gray-900">
                  Hỗ trợ
                </router-link>
                <n-divider class="!m-0" />
                <div
                  v-if="!isLoggedIn"
                  class="header-btn text-sm font-semibold leading-6 text-gray-900 hover:cursor-pointer"
                  @click="redirectToLogin"
                >
                  Đăng nhập
                </div>
                <n-space vertical v-else>
                  <router-link
                    v-if="user?.role === 'user'"
                    to="/user"
                    class="header-btn text-sm font-semibold leading -6 text-gray-900"
                  >
                    Profile
                  </router-link>
                  <router-link
                    v-if="user?.role === 'admin'"
                    to="/manage"
                    class="header-btn text-sm font-semibold leading -6 text-gray-900"
                  >
                    Quản lý
                  </router-link>
                  <div
                    class="header-btn text-sm font-semibold leading-6 text-gray-900 hover:cursor-pointer"
                    @click="openShoppingCart"
                  >
                    Giỏ hàng
                  </div>
                  <div
                    class="header-btn text-sm font-semibold leading-6 text-gray-900 hover:cursor-pointer"
                    @click="logout"
                  >
                    Đăng xuất
                  </div>
                </n-space>
              </n-space>
            </PopoverPanel>
          </transition>
        </Popover>
      </div>

      <div class="hidden md:flex gap-x-12 items-center">
        <router-link to="/home" class="header-btn text-sm font-semibold leading -6 text-gray-900">
          Trang chủ
        </router-link>
        <router-link to="/bookingball" class="header-btn text-sm font-semibold leading -6 text-gray-900">
          Đặt Sân
        </router-link>
        <router-link to="/aboutus" class="header-btn text-sm font-semibold leading-6 text-gray-900">
          Liên Hệ
        </router-link>
        <router-link to="/contact" class="header-btn text-sm font-semibold leading-6 text-gray-900">Hỗ trợ</router-link>
      </div>
      
      <div class="hidden md:flex flex-1 justify-end">
        <div v-if="user?.role !== 'admin'">
          <button v-if="!isLoggedIn" @click="redirectToLogin">Đăng nhập</button>
          <div class="dropdown" v-else>
            <div class="avatar" @click="toggleDropdown">
              <img
                src="https://th.bing.com/th/id/R.168824d10e82ec611011d572adb57d33?rik=ckwL%2fl%2f3xh1cFw&pid=ImgRaw&r=0"
                alt="Avatar"
              />
            </div>
            <div class="dropdown-content">
              <ul>
                <li @click="$router.push('/user')">
                  <div class="flex items-center">
                    <font-awesome-icon :icon="['fas', 'user']" class="icon mr-2" />
                    Profile
                  </div>
                </li>

                <li @click="openShoppingCart">
                  <div class="flex items-center">
                    <font-awesome-icon :icon="['fas', 'cart-shopping']" class="icon mr-2" />
                    Giỏ hàng
                  </div>
                </li>

                <li @click="logout">
                  <div class="flex items-center">
                    <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" class="icon mr-2" />
                    Đăng xuất
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <ShoppingCart :open="open" @close="open = false" />
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { Bars3Icon } from '@heroicons/vue/24/outline';
import ShoppingCart from '../components/QuanAo/ShoppingCart.vue';

const router = useRouter();
const open = ref(false);

const openShoppingCart = () => {
  open.value = true;
};
const isDropdownOpen = ref(false);
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  const toggleMenu = document.querySelector('.dropdown-content');
  toggleMenu.classList.toggle('active');
};

// Khai báo biến isLoggedIn và cập nhật ban đầu
const isLoggedIn = ref(false);
const user = ref(null); // Thay thế bằng null ban đầu
onMounted(() => {
  const loginSuccessHandler = () => {
    isLoggedIn.value = true;
    // Đoạn code khôi phục thông tin người dùng từ sessionStorage
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      user.value = JSON.parse(userData);
    }
  };
  window.addEventListener('login-success', loginSuccessHandler);

  // Kiểm tra xem có thông tin người dùng trong sessionStorage khi trang được tải lại
  const userData = sessionStorage.getItem('userData');
  if (userData) {
    user.value = JSON.parse(userData);
    isLoggedIn.value = true;
  }
});

const redirectToLogin = () => {
  router.push('/login');
};

const logout = () => {
  // Xóa thông tin người dùng từ sessionStorage
  sessionStorage.removeItem('userData');
  isLoggedIn.value = false;
  user.value = null;
  redirectToLogin();
};

const products = [
  { name: 'Đặt Sân Bóng', href: '#' },
  { name: 'Thuê Dụng Cụ', href: '#' },
  { name: 'Nước Uống', href: '#' }
];
</script>
<style scoped>
.header-content {
  box-shadow: 0 1px 8px 3px #ccc;
}

.header-btn:hover {
  color: rgb(235, 25, 25);
  border-bottom: 1px solid #000;
}

.header-content {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-shadow: 0 1px 8px 3px #ccc;
  background-color: #fff;
  z-index: 50;
}

.header-btn:hover {
  color: rgb(235, 25, 25);
  border-bottom: 1px solid #000;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon {
  width: 15px;
  height: 15px;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.avatar {
  cursor: pointer;
  height: 40px;
  width: 40px;
}

.avatar img {
  border-radius: 50%;
}

.dropdown-content {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background-color: rgb(255, 255, 255);
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 5px;
}

.dropdown-content.active {
  visibility: visible;
  opacity: 1;
}

.dropdown-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-content li {
  width: 130px;
  padding: 7px 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  display: flex;
  justify-content: start;
}

.dropdown-content a {
  text-decoration: none;
  color: #333;
  display: block;
}

.dropdown-content li:hover {
  background-color: #ccc;
  cursor: pointer;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.menu-item {
  padding: 0px 5px;
}
</style>
