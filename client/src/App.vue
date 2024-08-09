<template>
  <div class="wrapper-all">
    <n-loading-bar-provider>
      <n-message-provider>
        <TheHeader />
        <router-view class="view-container" />
        <FooterBall />
      </n-message-provider>
    </n-loading-bar-provider>
  </div>
</template>

<script setup>
import TheHeader from "./components/TheHeader.vue";
import FooterBall from "./components/FooterBall.vue";
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
  min-height: 100%;
}
</style>
