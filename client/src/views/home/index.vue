<template>
  <div>
    <Carousel />
    <FieldService />
    <PromotionBanner v-show="showBanner" @close="onCloseBanner" />
    <News />
    <Blog />
    <AboutUs />
  </div>
</template>

<script setup>
import { ref } from 'vue';

import Carousel from './components/Carousel.vue';
import FieldService from './components/FieldService.vue';
import News from './components/News.vue';
import PromotionBanner from './components/PromotionBanner.vue';
import Blog from './components/Blog.vue';
import AboutUs from './components/AboutUs.vue';

const showBanner = ref(true);
const onCloseBanner = () => {
  showBanner.value = false;
};
</script>
