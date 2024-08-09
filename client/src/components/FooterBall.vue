<template>
  <footer class="footer-content bg-white text-black py-1 sm:py-6">
    <div class="container mx-auto grid grid-cols-1 sm:grid-cols-2">
      <div
        class="footer-left border-b sm:border-b-0 sm:border-r border-gray-300"
      >
        <div class="flex flex-col items-center mb-7">
          <p class="text-sm font-semibold text-center mb-2">
            Trung Tâm Cho Thuê Sân Bóng Ace
          </p>
          <p class="text-sm text-center">
            <font-awesome-icon icon="location-dot" /> Phường Yên Nghĩa - Quận Hà
            Đông - Hà Nội
          </p>
          <p class="text-sm text-center">
            <font-awesome-icon :icon="['fas', 'envelope']" /> Email:
            Phenikaa@edu.vn
          </p>
          <p class="text-sm text-center">
            <font-awesome-icon icon="phone" /> Phone: 0246.6291 8118 | Số máy
            lẻ: 117
          </p>

          <div class="flex justify-center space-x-4 mt-4">
            <a href="#" class="icon-mxh">
              <font-awesome-icon icon="fab fa-facebook" />
            </a>
            <a href="#" class="icon-mxh">
              <font-awesome-icon :icon="['fab', 'twitter']" />
            </a>
            <a href="#" class="icon-mxh">
              <font-awesome-icon :icon="['fab', 'square-instagram']" />
            </a>
            <a href="#" class="icon-mxh">
              <font-awesome-icon icon="fab fa-google-plus" />
            </a>
          </div>
        </div>
      </div>

      <div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3725.7500875440132!2d105.748617!3d20.962549!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313452efff394ce3%3A0x391a39d4325be464!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBQaGVuaWthYQ!5e0!3m2!1svi!2sus!4v1695110174331!5m2!1svi!2sus"
          width="100%"
          height="200"
          style="border: 0; text-align: center"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from "vue";

const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
.footer-content {
  box-shadow: 1px 1px 8px 3px #ccc;
  width: 100%;
  bottom: 0;
}

.font-semibold {
  border-bottom: 1px solid #000;
  text-align: center;
}

.text-sm {
  padding: 5px;
}

.icon-mxh {
  padding: 15px;
  font-size: 25px;
  left: 10px;
}

.icon-mxh:hover {
  color: rgb(235, 25, 25);
}

.footer-left {
  border-right: 1px solid #000;
}
</style>
