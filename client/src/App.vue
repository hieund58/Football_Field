<template>
  <div class="wrapper">
    <n-loading-bar-provider>
      <n-message-provider>
        <TheHeader />
        <router-view class="bookingball" />
        <FooterBall />
      </n-message-provider>
    </n-loading-bar-provider>
  </div>
</template>

<script setup>

import TheHeader from './components/TheHeader.vue';
import FooterBall from './components/FooterBall.vue';

</script>
<style scoped>
.bookingball {
  padding-top: 130px;
}
</style>  