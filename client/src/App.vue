<template>
  <div class="wrapper-all">
    <n-loading-bar-provider>
      <n-message-provider>
        <TheHeader />
        <router-view class="view-container" :style="{ minHeight: height }" />
        <TheFooter v-show="!isAdminPage" />
      </n-message-provider>
    </n-loading-bar-provider>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from 'vue-router';

import TheHeader from "./layout/TheHeader.vue";
import TheFooter from "./layout/TheFooter.vue";

const route = useRoute();

const isAdminPage = computed(() => route.path === '/admin/home')
const height = computed(() => isAdminPage.value ? '100vh' : 'calc(100vh - 300px)')
</script>
<style scoped>
.wrapper-all {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
}
.view-container {
  padding-top: 70px;
}
</style>
