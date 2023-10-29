<template>
  <div class="lich-san">
    <n-grid cols="1">
      <n-gi>
        <n-button @click="toggleCalendar">Tắt/Bật Lịch Sân</n-button>
      </n-gi>
      <n-gi class="content">
        <div class="content">
          <n-calendar v-model="value" :is-date-disabled="isDateDisabled" @update:value="handleUpdateValue" v-show="showCalendar">
            Ngày {{ value.getDate() }} Tháng {{ value.getMonth() + 1 }}
          </n-calendar>
        </div>
      </n-gi>
          <n-gi class="view-san-bong">
      <h1>Lịch sân</h1>
      <div>
        <table class="custom-table view-table">
          <tr>
            <th>Giờ</th>
            <th>Số Sân</th>
            <th>Giá Tiền</th>
            <th>Trạng Thái</th>
          </tr>
       <tr v-for="(hourItem, index) in hoursOnCourt" :key="index" :class="{'row-red': hourItem.status === 'Đã Đặt', 'row-green': hourItem.status === 'Còn Trống'}">
  <td>{{ hourItem.hour }}</td>
  <td>
    <input v-model="hourItem.court" type="text" @input="updateCourt(index, $event)" />
  </td>
  <td>
    <input v-model="hourItem.price" type="text" @input="updatePrice(index, $event)" />
  </td>
  <td>{{ hourItem.status }}</td>
</tr>

        </table>
      </div>
    </n-gi>
    </n-grid>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue';
import { useMessage } from 'naive-ui';
import axios from 'axios';

const message = useMessage();
const value = ref(new Date());
const selectedDate = ref(new Date());
const selectedInfo = ref([]);
const showCalendar = ref(true);

const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value;
};

const isDateDisabled = () => {
  // Thêm logic kiểm tra ngày bị vô hiệu hóa ở đây
};

const handleUpdateValue = (value) => {
  // Xử lý khi giá trị lịch sân thay đổi ở đây
};

const fetchScheduleByDate = async (date) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/schedule/get-schedule-by-date/${date}`);
    const data = response.data;

    if (data.schedule) {
      selectedInfo.value = data.schedule.slots;
    } else {
      selectedInfo.value = [];
    }
  } catch (error) {
    console.error(error);
    message.error('Lỗi khi lấy thông tin lịch sân.');
  }
};

const hoursOnCourt = computed(() => {
  const startHour = 5;
  const endHour = 23;
  const hours = [];

  for (let hour = startHour; hour <= endHour; hour++) {
    hours.push({
      hour: `${hour}:00`,
      court: '',
      price: '',
      status: 'Còn Trống',
    });
  }

  return hours;
});
const updateCourt = (index, event) => {
  const updatedCourt = event.target.value;
  const hourItem = hoursOnCourt.value[index];

  // Gửi dữ liệu cập nhật lên máy chủ bằng Axios
  axios.put(`http://localhost:5000/api/schedule/update-court/${selectedDate.value.toISOString()}`, {
    hour: hourItem.hour,
    court: updatedCourt,
  })
  .then((response) => {
    if (response.status === 200) {
      hourItem.court = updatedCourt;
      message.success('Cập nhật số sân thành công');

      // Lưu dữ liệu vào cơ sở dữ liệu
      const updatedHour = {
        hour: hourItem.hour,
        court: updatedCourt,
        price: hourItem.price,
        status: hourItem.status,
      };

      // Thay đổi cách gửi dữ liệu lên máy chủ
      axios.put(`http://localhost:5000/api/schedule/update-court/${selectedDate.value.toISOString()}`, updatedHour)
      .then((response) => {
        if (response.status === 200) {
          message.success('Cập nhật số sân thành công');
        }
      })
      .catch((error) => {
        console.error(error);
        message.error('Lỗi khi cập nhật số sân');
      });
    }
  })
  .catch((error) => {
    console.error(error);
    message.error('Lỗi khi cập nhật số sân');
  });
};

const updatePrice = (index, event) => {
  const updatedPrice = event.target.value;
  const hourItem = hoursOnCourt.value[index];

  // Gửi dữ liệu cập nhật lên máy chủ bằng Axios
  axios.put(`http://localhost:5000/api/schedule/update-price/${selectedDate.value.toISOString()}`, {
    hour: hourItem.hour,
    price: updatedPrice,
  })
  .then((response) => {
    if (response.status === 200) {
      hourItem.price = updatedPrice;
      message.success('Cập nhật giá tiền thành công');

      // Lưu dữ liệu vào cơ sở dữ liệu
      const updatedHour = {
        hour: hourItem.hour,
        court: hourItem.court,
        price: updatedPrice,
        status: hourItem.status,
      };

      // Thay đổi cách gửi dữ liệu lên máy chủ
      axios.put(`http://localhost:5000/api/schedule/update-price/${selectedDate.value.toISOString()}`, updatedHour)
      .then((response) => {
        if (response.status === 200) {
          message.success('Cập nhật giá tiền thành công');
        }
      })
      .catch((error) => {
        console.error(error);
        message.error('Lỗi khi cập nhật giá tiền');
      });
    }
  })
  .catch((error) => {
    console.error(error);
    message.error('Lỗi khi cập nhật giá tiền');
  });
};

watch(selectedDate, (newSelectedDate) => {
  if (newSelectedDate) {
    fetchScheduleByDate(newSelectedDate);
  }
});
</script>

<style scoped>
.wrapper {
  height: 1000px;
}

.content {
  width: 100%;
  display: flex;
  justify-content: center;
}

.custom-table {
  border-collapse: collapse;
  width: 100%;
}

.custom-table th,
.custom-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.custom-table th {
  background-color: #f2f2f2;
}

.row-red {
  color: red;
}

.row-green {
  color: green;
}

.table-san {
  margin: 0px 10px 0px 10px;
}

.table-san h1 {
  font-size: 30px;
  font-weight: 500;
  padding: 10px;
}
</style>
