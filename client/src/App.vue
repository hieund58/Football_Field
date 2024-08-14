<template>
  <div class="wrapper-all">
    <n-loading-bar-provider>
      <n-message-provider>
        <TheHeader />
        <router-view class="view-container" />
        <TheFooter />
      </n-message-provider>
    </n-loading-bar-provider>
  </div>
</template>

<script setup>
import TheHeader from "./layout/TheHeader.vue";
import TheFooter from "./layout/TheFooter.vue";
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
  min-height: calc(100vh - 300px);
}
</style>
