<template>
  <div class="wrapper">
    <div class="hover:cursor-pointer flex items-center my-1 text-gray-500 text-[13px] pt-2" @click="backToList">
      <n-icon class="mr-1"><ArrowBackOutline /></n-icon>
      Quay lại danh sách sân
    </div>
    <div>
      <h1>{{ detail.name }}</h1>
      <h2>
        <font-awesome-icon icon="location-dot" />
        {{ detail.address }}
      </h2>
      <n-grid cols="1 m:3" responsive="screen" :x-gap="10">
        <n-gi :span="2">
          <n-carousel effect="fade" style="min-height: 400px" autoplay :interval="3000">
            <n-carousel-item v-for="imgSrc in detail.detailImgSrc" :style="{ width: '100%' }">
              <img class="carousel-img" :src="getImgUrl(imgSrc)" />
            </n-carousel-item>
          </n-carousel>
        </n-gi>

        <n-gi :span="1">
          <div class="bg-slate-100 h-full p-2 flex flex-col justify-between rounded-[10px]">
            <div class="field-info">
              <h2>Thông tin sân</h2>
              <div class="field-info__item">
                <span class="field-info__item--label">Giá sân</span>
                <span class="field-info__item--bold">{{ formatMoney(detail.price) }}</span>
              </div>
              <div class="field-info__item">
                <span class="field-info__item--label">Cơ sở vật chất</span>
                <span class="field-info__item--bold">{{ detail.description.facilities }}</span>
              </div>
              <div class="field-info__item">
                <span class="field-info__item--label">Cách thức di chuyển</span>
                <span class="field-info__item--bold">{{ detail.description.transportation }}</span>
              </div>
            </div>
            <div class="field-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3725.7500875440132!2d105.748617!3d20.962549!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313452efff394ce3%3A0x391a39d4325be464!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBQaGVuaWthYQ!5e0!3m2!1svi!2sus!4v1695110174331!5m2!1svi!2sus"
                width="100%"
                height="200"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </n-gi>
      </n-grid>
    </div>

    <field-schedule class="my-4" :field-data="fieldData" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { ArrowBackOutline } from '@vicons/ionicons5';

import { getImgUrl, formatMoney } from '@/utils/common';

import FieldSchedule from './FieldSchedule.vue';

const router = useRouter();
const route = useRoute();

const detail = ref({
  name: '',
  area: '',
  address: '',
  playerNum: '',
  price: '',
  detailImgSrc: '',
  description: {
    facilities: '',
    transportation: ''
  },
  schedules: {
    time: '',
    status: '',
    totalCourts: 0,
    bookedCourts: 0
  }
});

const _id = computed(() => route.params.id);

const fieldData = computed(() => ({
  id: _id.value,
  price: detail.value.price
}))

const backToList = () => {
  router.push('/bookingball');
};

const fetchDetail = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/field/${_id.value}`);
    detail.value = response.data;
    if (detail.value?.detailImgSrc)
      detail.value.detailImgSrc = JSON.parse(detail.value.detailImgSrc.replaceAll('\\', ''));
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu chi tiết sân:', error);
  }
};

onMounted(async () => {
  await fetchDetail();
});
</script>

<style scoped lang="scss">
.carousel-img {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.wrapper {
  height: auto;
  max-width: 1500px;
  width: 100%;
  display: flex;
  padding-left: 40px;
  padding-right: 40px;
  flex-direction: column;

  h1 {
    font-size: 25px;
    font-weight: 600;
  }

  h2 {
    font-size: 15px;
    font-weight: 400;
    padding-bottom: 5px;
  }
}

.content-detail {
  margin: 15px 0;
  box-shadow: 0 1px 8px 3px #ccc;
}

.field-info {
  h2 {
    font-size: 20px;
    font-weight: 600;
  }

  &__item {
    display: flex;
    justify-content: space-between;
  }

  &__item--label {
    margin-right: 10px;
    font-weight: 400;
  }

  &__item--bold {
    max-width: 200px;
    font-size: 15px;
    font-weight: 600;
  }
}

.field-map {
  border: 1px solid rgb(181, 179, 179);
  margin-top: 5px;
}
</style>
