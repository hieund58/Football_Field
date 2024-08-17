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
        <router-link
          to="/home"
          class="header-btn text-lg font-semibold leading -6 text-gray-900"
          :style="routePath === '/home' ? { color: 'rgb(235, 25, 25)', borderBottom: '1px solid #000' } : ''"
        >
          Trang chủ
        </router-link>
        <router-link
          to="/bookingball"
          class="header-btn text-lg font-semibold leading -6 text-gray-900"
          :style="routePath === '/bookingball' ? { color: 'rgb(235, 25, 25)' } : ''"
        >
          Đặt Sân
        </router-link>
        <router-link
          to="/store"
          class="header-btn text-lg font-semibold leading-6 text-gray-900"
          :style="routePath === '/store' ? { color: 'rgb(235, 25, 25)' } : ''"
        >
          Cửa hàng
        </router-link>
        <router-link
          to="/aboutus"
          class="header-btn text-lg font-semibold leading-6 text-gray-900"
          :style="routePath === '/aboutus' ? { color: 'rgb(235, 25, 25)' } : ''"
        >
          Liên Hệ
        </router-link>
        <router-link
          to="/contact"
          class="header-btn text-lg font-semibold leading-6 text-gray-900"
          :style="routePath === '/contact' ? { color: 'rgb(235, 25, 25)' } : ''"
        >
          Hỗ trợ
        </router-link>
        <router-link
          v-if="user?.role === 'admin'"
          to="/admin/home"
          class="header-btn text-lg font-semibold leading-6 text-gray-900"
          :style="routePath === '/admin/home' ? { color: 'rgb(235, 25, 25)' } : ''"
        >
          Admin
        </router-link>
      </div>

      <div class="hidden md:flex flex-1 justify-end">
        <div v-if="!isLoggedIn || user?.role === 'user'" class="flex items-center">
          <button
            v-if="!isLoggedIn"
            class="text-lg font-semibold leading-6 text-gray-900 hover:cursor-pointer mr-10"
            @click="redirectToLogin"
          >
            Đăng nhập
          </button>
          <div v-else class="flex flex-row items-center">
            <n-badge :value="hasItemsInCart" :max="9" class="mr-4">
              <div class="avatar" title="Giỏ hàng" @click="openShoppingCart">
                <img
                  src="@/assets/images/shopping-cart.png"
                  alt="Avatar"
                  class="w-[30px] h-[30px] object-contain m-auto mt-[6px]"
                />
              </div>
            </n-badge>

            <div class="dropdown">
              <div class="avatar" @click="toggleDropdown">
                <img
                  src="@/assets/images/user.png"
                  alt="Avatar"
                  class="w-[30px] h-[30px] object-contain m-auto mt-[5px]"
                />
              </div>

              <div class="dropdown-content text-sm">
                <ul>
                  <li @click="$router.push('/user')">
                    <div class="flex items-center">
                      <font-awesome-icon :icon="['fas', 'user']" class="icon mr-2" />
                      Profile
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
      </div>
    </nav>
    <ShoppingCart :open="open" @close="open = false" />
  </header>
</template>

<script setup>
import { ref, inject, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { Bars3Icon } from '@heroicons/vue/24/outline';
import ShoppingCart from '../components/shopping-cart/ShoppingCart.vue';

const router = useRouter();
const route = useRoute();
console.log('🚀 ~ route:', route);

const cartItems = inject('cartItems');

const open = ref(false);
const isDropdownOpen = ref(false);
const isLoggedIn = ref(false);
const user = ref(null);

const hasItemsInCart = computed(() => cartItems.value?.length);
const routePath = computed(() => route.path);
console.log('🚀 ~ routePath:', routePath);

const openShoppingCart = () => {
  open.value = true;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  const toggleMenu = document.querySelector('.dropdown-content');
  toggleMenu.classList.toggle('active');
};

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

onMounted(() => {
  const loginSuccessHandler = () => {
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
<style scoped lang="scss">
.header-content {
  box-shadow: 0 1px 8px 3px #ccc;
}

.header-content {
  font-size: 30px !important;
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
  margin-right: 2rem;
}

.avatar {
  border-radius: 50%;
  height: 40px;
  width: 40px;
  overflow: hidden;
  object-fit: contain;
  background-color: #d4d4d4;
}

.avatar:hover {
  cursor: pointer;
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
