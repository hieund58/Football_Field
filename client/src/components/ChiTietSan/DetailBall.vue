<template>
  <div class="waraper">
    <div class="header">
      <h1>{{ detail.name }}</h1>
      <h2><font-awesome-icon icon="location-dot" /> {{ detail.area }}</h2>
      <n-carousel effect="card" prev-slide-style="transform: translateX(-150%) translateZ(-800px);"
                  next-slide-style="transform: translateX(50%) translateZ(-800px);" style="height: 500px" :show-dots="false">
        <n-carousel-item :style="{ width: '60%' }">
          <img class="carousel-img"
               src="https://phenikaa-uni.edu.vn:3600/fs/vi/san-bong-nha-da-nang-va-khu-the-chat/sb1.jpg">
        </n-carousel-item>
        <n-carousel-item :style="{ width: '60%' }">
          <img class="carousel-img"
               src="https://sanconhantao.vn/wp-content/uploads/2020/10/San-dai-hoc-Phenikaa-4.jpg">
        </n-carousel-item>
        <n-carousel-item :style="{ width: '60%' }">
          <img class="carousel-img"
               src="https://thegioithethao.vn/images/products_soccer/2021/01/28/large/san-bong-dai-hoc-phenika_1611847506.jpg">
        </n-carousel-item>
        <n-carousel-item :style="{ width: '60%' }">
          <img class="carousel-img"
               src="https://th.bing.com/th/id/OIP.O6gVWOI4AqvFSdbu9pZEMAHaHa?pid=ImgDet&w=1024&h=1024&rs=1">
        </n-carousel-item>
      </n-carousel>
    </div>

    <div class="content-detail">
      <n-grid cols="5">
        <n-gi span="3">
          <div class="detail-1">
            <h1>Mô Tả Sân</h1>
          </div>
          <div class="detail">
            <div class="detail-2">
              <ul >
                <span class="detail-header">Cơ Sở Vật Chất Và Tiện Ích Tại Sân</span>
                <li class="detail-content">{{ detail.description.facilities }}</li>
              </ul>
              <ul>
                <span class="detail-header">Giá Thuê</span>
                <li class="detail-content">{{ detail.description.prices }}</li>
              </ul>
              <ul >
                <span class="detail-header">Cách Thức Di Chuyển</span>
                <li class="detail-content">{{ detail.description.transportation }}</li>
              </ul>
            </div>
          </div>
        </n-gi>
        <n-gi span="2">
          <div class="detail-11">
            <h1>Lịch Sân</h1>
          </div>
          <div class="content-time">
            <n-table :bordered="true" :single-line="false">
              <thead>
                <tr>
                  <th class="status-header">Thời gian</th>
                  <th class="status-header">Tình trạng</th>
                  <th class="status-header">Số sân còn trống</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="status-header">{{ detail.schedules.time }}</td>
                  <td class="status-header">{{ detail.schedules.status }}</td>
                  <td class="status-header">{{ detail.schedules.totalCourts - detail.schedules.bookedCourts }}</td>
                </tr>
              </tbody>
            </n-table>
          </div>
          <div class="css-content-datetime">
            <span class="header-datsan">Đặt Sân Tại Đây</span>
            <div class="content-datetime">
              <input class="date-time" type="date" v-model="selectedDate" />
              <input class="date-time" type="time" v-model="selectedTime" />
              <router-link to="/thanhtoanball">
                <button class="bt-datsan" @click="submitDateTime">Đặt Sân</button>
              </router-link>
            </div>
            <p v-if="!isFormValid" style="color: red; padding-left: 140px;">Vui lòng chọn ngày và giờ trước khi đặt sân.</p>
          </div>
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const _id = computed(() => route.params.id);
const detail = ref({
  name: '',
  area: '',
  address: '',
  people: '',
  description: {
    facilities: '',
    prices: '',
    transportation: '',
  },
  schedules: {
    time: '',
    status: '',
    totalCourts: 0,
    bookedCourts: 0,
  },
});
const productInfo = ref({
  name: '',
  area: '',
  description: {
    facilities: '',
    prices: '',
    transportation: '',
  },
  schedules: {
    date: '',
    time: '',
    status: '',
    price: '',
    totalCourts: '',
  }
});
const selectedDate = ref('');
const selectedTime = ref('');
const isFormValid = ref(true);

const fetchDetail = async () => {
  // Kiểm tra _id có giá trị hợp lệ
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${_id.value}`);
      detail.value = response.data;
      
      console.log(detail.value);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu chi tiết sân:', error);
    }
  
};


const submitDateTime = () => {
  if (!selectedDate.value || !selectedTime.value) {
    isFormValid.value = false;
  } else {
    isFormValid.value = true;
    // Thực hiện xử lý việc đặt sân
  }
};

onMounted(() => {
  fetchDetail();
});
</script>
  

<style scoped>
.carousel-img {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  object-fit: cover;
  padding: 40px 0;
}

.waraper {
  height: auto;
  max-width: 1500px;
  width: 100%;
  margin: 0 auto;
}

.waraper h1 {
  font-size: 30px;
  font-weight: 600;
}

.content-detail {
  margin: 15px 0;
  box-shadow: 0 1px 8px 3px #ccc;
}

.header {
  padding-top: 50px;
}

.content-time {
  border: 1px solid #ccc;
  margin: 5px;
}

.status-header {
  width: 33.33%; /* Điều chỉnh chiều rộng cột tại đây */
  text-align: center;
}

.detail {
  display: flex;
  justify-content: center;
  background-color: #fff;
}

.detail-1 h1 {
  font-size: 30px;
  font-weight: 600;
  padding: 10px 15px;
}

.detail-1 {
  background-color: #ECECEC;
}

.detail-11 {
  background-color: #ECECEC;
}

.detail-11 h1 {
  font-size: 30px;
  font-weight: 600;
  padding: 10px 20px;
}

.detail-header {
  font-size: 18px;
  font-weight: 600;
  margin-left: -50px;
}

.detail-content {
  padding: 5px;
  list-style-type: circle;
}

.detail-2 ul {
  margin: 5px;
  padding: 14px 0px;
}

.red-cell {
  color: red;
}

.green-cell {
  color: green;
}

.content-datetime {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 40px 0 0 100px;
  max-width: 450px;
  width: 100%;
}

.date-time {
  padding: 5px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  float: left;
  border-radius: 0.3rem;
}

.bt-datsan {
  padding: 5px;
  border: none;
  background-color: #fa4516;
  color: #fff;
  cursor: pointer;
  font-size: 17px;
  transition: background-color 0.3s ease;
  border-radius: 0.3rem;
}

.bt-datsan:hover {
  background-color: #b63717;
}

.css-content-datetime {
  box-shadow: 0 1px 8px 3px #ccc;
  height: 210px;
  margin: 6px;
  margin-top: 50px;
}

.css-content-datetime p {
  padding-top: 5px;
}

.header-datsan {
  display: flex;
  justify-content: center;
  font-size: 20px;
  padding-top: 30px;
  font-weight: 600;
}
</style>
