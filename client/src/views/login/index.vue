<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <Transition name="fade" :duration="300" mode="out-in">
      <LoginAdmin v-if="showAdmin" @go-user="showUserScreen" />
      <LoginUser v-else-if="showUser" @go-admin="showAdminScreen" @go-register="showRegisterScreen" />
      <Register v-else @go-user="showUserScreen" />
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import LoginAdmin from './components/LoginAdmin.vue';
import LoginUser from './components/LoginUser.vue';
import Register from './components/Register.vue';

const showAdmin = ref(false);
const showUser = ref(true);

const showUserScreen = () => {
  showAdmin.value = false;
  showUser.value = true;
};
const showAdminScreen = () => {
  showAdmin.value = true;
  showUser.value = false;
};

const showRegisterScreen = () => {
  showAdmin.value = false;
  showUser.value = false;
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
