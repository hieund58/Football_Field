<template>
  <header class="header-content fixed top-0 left-0 w-full bg-white z-50">
    <nav class="mx-auto flex items-center justify-between p-1 lg:px-3" aria-label="Global">
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
        <router-link to="/store" class="header-btn text-sm font-semibold leading-6 text-gray-900">Cửa hàng</router-link>
        <router-link to="/aboutus" class="header-btn text-sm font-semibold leading-6 text-gray-900">
          Liên Hệ
        </router-link>
        <router-link to="/contact" class="header-btn text-sm font-semibold leading-6 text-gray-900">Hỗ trợ</router-link>
        <router-link
          v-if="user?.role === 'admin'"
          to="/admin/home"
          class="header-btn text-sm font-semibold leading-6 text-gray-900"
        >
          Admin
        </router-link>
      </div>

      <div class="hidden md:flex flex-1 justify-end">
        <div v-if="!isLoggedIn || user?.role === 'user'">
          <button
            v-if="!isLoggedIn"
            class="text-sm font-semibold leading-6 text-gray-900 hover:cursor-pointer mr-10"
            @click="redirectToLogin"
          >
            Đăng nhập
          </button>
          <div class="dropdown" v-else>
            <n-badge :value="hasItemsInCart" :max="9">
              <div class="avatar" @click="toggleDropdown">
                <img
                  src="https://th.bing.com/th/id/R.168824d10e82ec611011d572adb57d33?rik=ckwL%2fl%2f3xh1cFw&pid=ImgRaw&r=0"
                  alt="Avatar"
                />
              </div>
            </n-badge>
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
                    <div class="mr-2">Giỏ hàng</div>
                    <n-badge :value="hasItemsInCart" :max="9"></n-badge>
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
import { ref, inject, computed } from 'vue';
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

const isLoggedIn = ref(false);
const user = ref(null);

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

const cartItems = inject('cartItems');
const hasItemsInCart = computed(() => cartItems.value?.length);

onMounted(() => {
  const loginSuccessHandler = () => {
    // Đoạn code khôi phục thông tin người dùng từ sessionStorage
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      user.value = JSON.parse(userData);
      isLoggedIn.value = true;
    } else {
      user.value = {};
      isLoggedIn.value = false;
    }
  };
  window.addEventListener('user-data-change', loginSuccessHandler);

  // Kiểm tra xem có thông tin người dùng trong sessionStorage khi trang được tải lại
  const userData = sessionStorage.getItem('userData');
  if (userData) {
    user.value = JSON.parse(userData);
    isLoggedIn.value = true;
  }
});
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
  box-shadow: 0 1px 6px 1px #ccc;
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
  width: 140px;
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
