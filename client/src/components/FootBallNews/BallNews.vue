<template>
  <div class="wrapper">
    <h1 class="text-2xl font-bold tracking-tight text-gray-900 text-center">
      Tin Tức Bóng Đá
    </h1>
    <div class="content-1">
      <n-grid cols="5">
        <n-gi span="1" class="lg:span-2 xl:span-1">
          <n-grid :x-gap="12" :y-gap="8" :cols="1">
            <n-gi>
              <div class="left-1">
                <img
                  class="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  :src="footballItems[0] ? footballItems[0].imgFootBall : ''"
                  alt=""
                />
                <a class="chu-tin">{{
                  footballItems[0] ? footballItems[0].name : ""
                }}</a>
              </div>
            </n-gi>
            <n-gi>
              <div class="left-2">
                <img
                  class="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  :src="footballItems[1] ? footballItems[1].imgFootBall : ''"
                  alt=""
                />
                <a class="chu-tin">{{
                  footballItems[1] ? footballItems[1].name : ""
                }}</a>
              </div>
            </n-gi>
          </n-grid>
        </n-gi>

        <n-gi span="3" class="lg:span-4 xl:span-3">
          <router-link to="/tintuc" class="mid"
            ><img
              class="lg:h-full lg:w-full"
              :src="footballItems[2] ? footballItems[2].imgFootBall : ''"
              alt=""
            />
            <a>{{
              footballItems[2] ? footballItems[2].name : ""
            }}</a></router-link
          >
        </n-gi>

        <n-gi span="1" class="lg:span-2 xl:span-1">
          <n-grid :x-gap="12" :y-gap="8" :cols="1">
            <n-gi>
              <div class="right-1">
                <img
                  class="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  :src="footballItems[3] ? footballItems[3].imgFootBall : ''"
                  alt=""
                />
                <a class="chu-tin">{{
                  footballItems[3] ? footballItems[3].name : ""
                }}</a>
              </div>
            </n-gi>
            <n-gi>
              <div class="right-2">
                <img
                  class="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  :src="footballItems[4] ? footballItems[4].imgFootBall : ''"
                  alt=""
                />
                <a class="chu-tin">{{
                  footballItems[4] ? footballItems[4].name : ""
                }}</a>
              </div>
            </n-gi>
          </n-grid>
        </n-gi>
      </n-grid>
    </div>
    <h1 class="text-2xl font-bold tracking-tight text-gray-900 text-center">
      Tin Tức Liên Quan
    </h1>
    <div class="content-2">
      <n-grid cols="5">
        <n-gi
          v-for="item in displayedItems"
          :key="item.id"
          span="1"
          class="lg:span-2 xl:span-1"
        >
          <n-grid :x-gap="12" :y-gap="8" :cols="1">
            <n-gi>
              <div class="news-item">
                <img :src="item.imgFootBall" alt="" class="image-item" />
                <a class="chu-tin">{{ item.name }}</a>
              </div>
            </n-gi>
          </n-grid>
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const footballItems = ref([]);
const displayedItems = ref([]);
let currentIndex = 0;

const fetchData = () => {
  axios
    .get("https://66975db402f3150fb66d5924.mockapi.io/news")
    .then((response) => {
      if (Array.isArray(response.data) && response.data.length >= 10) {
        footballItems.value = response.data;
        updateDisplayedItems();
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

const updateDisplayedItems = () => {
  displayedItems.value = [];
  for (let i = 0; i < 5; i++) {
    const nextIndex = (currentIndex + i) % footballItems.value.length;
    displayedItems.value.push(footballItems.value[nextIndex]);
  }
  currentIndex = (currentIndex + 1) % footballItems.value.length;
};

onMounted(() => {
  fetchData();
  setInterval(updateDisplayedItems, 3000);
});
</script>

<style scoped>
.wrapper {
  width: 80%;
  margin: auto;
  padding: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  box-shadow: 1px 1px 8px 3px #ccc;
}

.wrapper h1 {
  padding: 10px;
}

.left-1 {
  margin: 5px;
}

.left-2 {
  margin: 5px;
}

.right-1 {
  margin: 5px;
}

.right-2 {
  margin: 5px;
}

.mid {
  margin: 5px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.chu-tin {
  font-size: 15px;
}

.mid img {
  height: 520px;
  width: 800px;
}

.mid a {
  font-size: 15px;
  padding: 5px;
}

.chu-tin {
  font-size: 15px;
}

.news-item {
  margin: 5px;
}

.image-item {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.content-1 {
  border-bottom: 1px solid #000;
}

.content-2 {
  margin-top: 10px;
}

@media (max-width: 768px) {
  .wrapper {
    width: 90%;
  }

  .mid img {
    height: auto;
    width: 100%;
  }

  .chu-tin {
    font-size: 12px;
  }
}
</style>
