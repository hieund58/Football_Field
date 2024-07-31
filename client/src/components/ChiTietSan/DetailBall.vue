<template>
  <div class="wrapper">
    <div class="hover:cursor-pointer flex items-center my-1 text-gray-500 text-[13px]" @click="backToList">
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

    <field-schedule class="mt-4" :field-id="_id" />

    <div class="content-detail">
      <n-grid cols="5">
        <n-gi span="3">
          <div class="detail-1">
            <h1>Mô Tả Sân</h1>
          </div>
          <div class="detail">
            <div class="detail-2">
              <ul>
                <span class="detail-header">Cơ Sở Vật Chất Và Tiện Ích Tại Sân</span>
                <li class="detail-content">
                  {{ detail.description.facilities }}
                </li>
              </ul>
              <ul>
                <span class="detail-header">Giá Thuê</span>
                <li class="detail-content">{{ detail.price }}</li>
              </ul>
              <ul>
                <span class="detail-header">Cách Thức Di Chuyển</span>
                <li class="detail-content">
                  {{ detail.description.transportation }}
                </li>
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
                  <th class="status-header">Giá tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(slot, index) in selectedInfo" :key="slot.hour">
                  <td>{{ slot.hour }}</td>
                  <td>{{ slot.status }}</td>
                  <td>{{ slot.court }}</td>
                  <td>{{ slot.price }}</td>
                </tr>
              </tbody>
            </n-table>
          </div>
          <div class="css-content-datetime">
            <span class="header-datsan">Đặt Sân Tại Đây</span>
            <div class="content-datetime">
              <n-date-picker
                v-model="selectedDate"
                type="date"
                @update:value="onDateChange"
                format="yyyy-MM-dd"
              ></n-date-picker>
              <select v-model="selectedTime" class="date-time" @change="handleTimeChange">
                <option value="">Chọn giờ</option>
                <option v-for="hour in hoursList" :key="hour" :value="hour">
                  {{ hour }}
                </option>
              </select>
              <router-link :to="getThanhToanBallLink">
                <button
                  class="bt-datsan"
                  @click="submitDateTime"
                  :disabled="!isFormValid || !selectedDate || !selectedTime"
                >
                  Đặt Sân
                </button>
              </router-link>
            </div>
            <p v-if="!isFormValid && (!selectedDate || !selectedTime)" style="color: red; padding-left: 140px">
              {{ formErrorMessage }}
            </p>
          </div>
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { ArrowBackOutline } from '@vicons/ionicons5';

import { getImgUrl, formatMoney } from '@/utils/common';

import FieldSchedule from './FieldSchedule.vue'

const router = useRouter();
const route = useRoute();
const _id = computed(() => route.params.id);

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

const backToList = () => {
  router.push('/bookingball')
}


const selectedInfo = ref([
  {
    date: '',
    sanId: '',
    slots: [
      {
        hour: '',
        status: '',
        court: '',
        price: '' // Thêm trường giá tiền
      }
    ]
  }
]);
const hoursList = ref([
  '05:00 AM',
  '06:00 AM',
  '07:00 AM',
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 AM',
  '13:00 AM',
  '14:00 AM',
  '15:00 AM',
  '16:00 AM',
  '17:00 AM',
  '18:00 AM',
  '19:00 AM',
  '20:00 AM',
  '21:00 AM',
  '22:00 AM',
  '23:00 AM'
]);
const selectedDate = ref(DateTime.now()); // Sử dụng ngày mặc định tại đây
const selectedTime = ref({});
const totalPrice = ref(0); // Khởi tạo biến price
const isFormValid = ref(true);
const formErrorMessage = ref('');

import { DateTime } from 'luxon';

const fetchDetail = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/field/${_id.value}`);
    detail.value = response.data;
    if (detail.value?.detailImgSrc)
      detail.value.detailImgSrc = JSON.parse(detail.value.detailImgSrc.replaceAll('\\', ''));

    // Kiểm tra xem detail đã được tải thành công và detail._id không rỗng
    if (detail.value && detail.value._id) {
      // In ra detail theo _id hiện tại
      console.log('Detail cho _id hiện tại:', detail.value);

      // Gọi hàm fetchScheduleByDate ở đây
      fetchScheduleByDate(selectedDate.value);
    } else {
      console.error('Chi tiết sản phẩm không hợp lệ.');
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu chi tiết sân:', error);
  }
};

const fetchScheduleByDate = async (selectedDateValue, sanId) => {
  try {
    if (!selectedDateValue || !sanId) {
      console.error('Vui lòng chọn sản phẩm và ngày trước khi lấy lịch sân.');
      return;
    }

    const isoDateString = selectedDateValue.toISODate();
    const axiosInstance = axios.create({
      baseURL: 'http://localhost:5000/api/schedule/'
    });

    const params = {
      selectedDateValue: isoDateString
    };

    // Truyền `sanId` như một tham số trong URL
    const response = await axiosInstance.get(`get-schedule-by-date/${isoDateString}/${sanId}`, {
      params: { selectedDateValue: isoDateString }
    });

    if (response.data.schedule) {
      selectedInfo.value = response.data.schedule.slots;
    } else {
      console.error('Không tìm thấy lịch sân cho sản phẩm này.');
    }
  } catch (error) {
    console.error('Lỗi khi lấy lịch sân:', error);
  }
};

// Hàm xử lý sự kiện khi ngày thay đổi
const onDateChange = date => {
  if (date instanceof Date) {
    selectedDate.value = DateTime.fromJSDate(date); // Chuyển đổi sang đối tượng DateTime của Luxon
    // Truyền sanId từ sản phẩm hiện tại và selectedDate.value từ date picker
    fetchScheduleByDate(selectedDate.value, detail.value._id);
    // Xóa thông báo lỗi nếu có
    isFormValid.value = true;
    formErrorMessage.value = '';
  } else if (typeof date === 'number') {
    const dateInMilliseconds = DateTime.fromMillis(date); // Chuyển đổi sang đối tượng DateTime của Luxon
    selectedDate.value = dateInMilliseconds;
    // Truyền sanId từ sản phẩm hiện tại và dateInMilliseconds từ date picker
    fetchScheduleByDate(dateInMilliseconds, detail.value._id);
    // Xóa thông báo lỗi nếu có
    isFormValid.value = true;
    formErrorMessage.value = '';
    updateTotalPrice();
  } else {
    console.error('Ngày không hợp lệ:', date);
  }
};

const handleTimeChange = () => {
  // Lấy giá trị giờ được chọn trong phần tử <select> và gán vào biến selectedTime
  const selectTime = selectedTime.value;
  console.log(selectTime);
  updateTotalPrice();
};

const updateTotalPrice = () => {
  if (selectedDate.value && selectedTime.value && selectedInfo.value) {
    const selectedDateISO = selectedDate.value.toISODate();
    console.log('Selected Date:', selectedDateISO);
    console.log('Selected Time:', selectedTime.value);
    console.log(selectedInfo);
    // Tìm lịch sân phù hợp
    const matchingSlot = selectedInfo.value.find(slots => slots.hour === selectedTime.value);

    if (matchingSlot) {
      totalPrice.value = matchingSlot.price;
    }
  }

  console.log('Total Price:', totalPrice.value);
};

const submitDateTime = () => {
  if (!selectedDate.value || !selectedTime.value) {
    isFormValid.value = false;
    formErrorMessage.value = 'Vui lòng chọn ngày và giờ trước khi đặt sân.';
  } else {
    const userData = getUserDataFromSessionStorage();
    if (userData && userData.email) {
      isFormValid.value = true;
      router.push(getThanhToanBallLink.value);
    } else {
      formErrorMessage.value = 'Bạn phải đăng nhập và cung cấp địa chỉ email trước khi đặt sân.';
    }
  }
};

const getUserDataFromSessionStorage = () => {
  // Kiểm tra xem có dữ liệu userData trong sessionStorage không
  const userDataString = sessionStorage.getItem('userData');
  if (userDataString) {
    try {
      // Parse dữ liệu userData từ JSON
      const userData = JSON.parse(userDataString);
      console.log('Dữ liệu userData:', userData); // In dữ liệu userData vào console
      return userData;
    } catch (error) {
      console.error('Lỗi khi phân tích dữ liệu userData từ sessionStorage:', error);
    }
  }
  return null;
};

const getThanhToanBallLink = computed(() => {
  return {
    name: 'thanhtoanball',
    params: {
      id: _id.value,
      detailData: detail,
      selectTime: selectedTime.value,
      selectDate: selectedDate.value.toISODate(),
      sanId: _id.value
    },
    query: {
      price: totalPrice.value // Truyền giá tiền qua query
    }
  };
});
// Hàm để lấy sanId từ mảng selectedInfo
const getSanIdFromSelectedInfo = selectedInfo => {
  let sanId = _id.value;

  if (selectedInfo && selectedInfo.length > 0) {
    const schedule = selectedInfo[0]; // Chọn phần tử đầu tiên
    if (schedule && schedule.sanId) {
      sanId = schedule.sanId;
    }
  }

  return sanId;
};
onMounted(() => {
  console.log('_id:', _id.value);
  console.log('detail:', detail.value);
  // Lấy sanId từ mảng selectedInfo
  const sanId = getSanIdFromSelectedInfo(selectedInfo.value);
  console.log('sanId:', sanId);
  fetchDetail();
  const selectTime = handleTimeChange(selectedTime.value);
  console.log('time:', selectTime);
  // Gọi onDateChange với giá trị ban đầu của selectedDate
  updateTotalPrice;
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
  margin-top: 5px
}

.content-time {
  border: 1px solid #ccc;
  margin: 5px;
}

.status-header {
  width: 33.33%;
  /* Điều chỉnh chiều rộng cột tại đây */
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
  background-color: #ececec;
}

.detail-11 {
  background-color: #ececec;
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
  margin: 0px 5px;
  border-radius: 0.3rem;
}

.bt-datsan {
  width: 100px;
  margin: 0px 10px;
  padding: 5px;
  border: none;
  background-color: #fa4516;
  color: #fff;
  cursor: pointer;
  font-size: 15px;
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
