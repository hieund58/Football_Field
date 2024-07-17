<template>
  <div class="lich-san">
    <n-grid cols="1">
      <n-gi>
        <n-button @click="toggleCalendar">Tắt/Bật Lịch Sân</n-button>
      </n-gi>
      <n-gi class="content">
        <div class="content">
          <h2>{{ viewData && viewData.name }}</h2>
          <p>{{ viewData && viewData.address }}</p>
          <n-date-picker
            v-model="selectedDate"
            type="date"
            @update:value="onDateChange"
          ></n-date-picker>
        </div>
      </n-gi>
      <n-gi class="view-san-bong">
        <h1>Lịch sân</h1>
        <div>
          <!-- Kiểm tra nếu isDataAvailable là true, hiển thị dữ liệu từ cơ sở dữ liệu -->
          <table class="custom-table view-table" v-if="isDataAvailable">
            <tr>
              <th>Giờ</th>
              <th>Số Sân</th>
              <th>Giá Tiền</th>
              <th>Trạng Thái</th>
            </tr>
            <tr v-for="(hour, index) in selectedInfo" :key="index">
              <td>{{ hour.hour }}</td>
              <td>
                <input
                  v-model="hour.court"
                  type="text"
                  @input="updateCourt(hour)"
                />
              </td>
              <td>
                <input
                  v-model="hour.price"
                  type="text"
                  @input="updatePrice(hour)"
                />
              </td>
              <td>{{ hour.status }}</td>
            </tr>
          </table>
        </div>
      </n-gi>
    </n-grid>
  </div>
</template>

<script>
import { ref, onMounted, defineProps } from "vue";
import { useMessage } from "naive-ui";
import axios from "axios";
import { DateTime } from "luxon";
export default {
  props: {
    viewData: Object,
    sanId: String,
  },
  setup(props) {
    const selectedDate = ref(DateTime.now());
    const showCalendar = ref(true);
    const isDataAvailable = ref(false);

    // Use ref for selectedInfo and initialize it with an empty array
    const selectedInfo = ref([
      {
        slots: [
          {
            hour: "",
            status: "",
            court: "",
            price: "", // Thêm trường giá tiền
          },
        ],
      },
    ]);

    const message = useMessage();

    const toggleCalendar = () => {
      showCalendar.value = !showCalendar.value;
    };

    const generateSchedule = () => {
      const hours = [];
      for (let i = 5; i <= 23; i++) {
        const hour = i < 10 ? `0${i}:00 AM` : `${i}:00 AM`;
        hours.push({ hour, court: "", price: "", status: "Trống" });
      }
      selectedInfo.value = hours; // Use selectedInfo.value for assignment
    };

    const fetchScheduleByDate = async (selectedDateValue) => {
      try {
        if (!selectedDateValue || !props.sanId) {
          isDataAvailable.value = false;
          return;
        }

        const isoDateString = selectedDateValue.toISODate();
        const axiosInstance = axios.create({
          baseURL: "http://localhost:5000/api/schedule/",
        });

        const params = {
          selectedDateValue: isoDateString,
        };

        // Truyền props.sanId như một tham số trong URL
        const response = await axiosInstance.get(
          `get-schedule-by-date/${isoDateString}/${props.sanId}`,
          { params: { selectedDateValue: isoDateString } },
        );

        if (response.status === 200) {
          selectedInfo.value = response.data.schedule.slots; // Use selectedInfo.value for assignment
          isDataAvailable.value = true;
          console.log(props.sanId);
        } else {
          isDataAvailable.value = false;
          message.error("Lỗi khi lấy thông tin lịch sân.");
        }
      } catch (error) {
        isDataAvailable.value = false;
        console.error(error);
        message.error("Lỗi khi lấy thông tin lịch sân.");
      }
    };

    // Hàm xử lý sự kiện khi ngày thay đổi
    const onDateChange = (date) => {
      if (date instanceof Date) {
        selectedDate.value = DateTime.fromJSDate(date); // Chuyển đổi sang đối tượng DateTime của Luxon
        // Truyền sanId từ sản phẩm hiện tại và selectedDate.value từ date picker
        fetchScheduleByDate(selectedDate.value);
      } else if (typeof date === "number") {
        const dateInMilliseconds = DateTime.fromMillis(date); // Chuyển đổi sang đối tượng DateTime của Luxon
        selectedDate.value = dateInMilliseconds;
        // Truyền sanId từ sản phẩm hiện tại và dateInMilliseconds từ date picker
        fetchScheduleByDate(dateInMilliseconds);
      } else {
        console.error("Ngày không hợp lệ:", date);
      }
    };

    const updateCourt = (hour) => {
      const updatedCourt = hour.court;
      const formattedDate = selectedDate.value.toISODate();
      const sanId = props.sanId;

      // Sử dụng axios.put để gửi yêu cầu cập nhật số sân
      axios
        .put(
          `http://localhost:5000/api/schedule/update-court/${formattedDate}`,
          {
            date: formattedDate,
            hour: hour.hour,
            court: updatedCourt,
            sanId: sanId,
          },
        )
        .then((response) => {
          if (response.status === 200) {
            // Sau khi cập nhật thành công, gọi fetchScheduleByDate để cập nhật trạng thái bảng
            fetchScheduleByDate(selectedDate.value);
            message.success("Cập nhật số sân thành công");
          }
        })
        .catch((error) => {
          console.error(error);
          message.error("Lỗi khi cập nhật số sân");
        });
    };

    const updatePrice = (hour) => {
      const updatedPrice = hour.price;
      const formattedDate = selectedDate.value.toISODate();
      const sanId = props.sanId;

      // Sử dụng axios.put để gửi yêu cầu cập nhật giá tiền
      axios
        .put(
          `http://localhost:5000/api/schedule/update-price/${formattedDate}`,
          {
            date: formattedDate,
            hour: hour.hour,
            price: updatedPrice,
            sanId: sanId,
          },
        )
        .then((response) => {
          if (response.status === 200) {
            // Sau khi cập nhật thành công, gọi fetchScheduleByDate để cập nhật trạng thái bảng
            fetchScheduleByDate(selectedDate.value);
            message.success("Cập nhật giá tiền thành công");
          }
        })
        .catch((error) => {
          console.error(error);
          message.error("Lỗi khi cập nhật giá tiền");
        });
    };

    onMounted(() => {
      generateSchedule();
    });

    return {
      isDataAvailable,
      selectedDate,
      showCalendar,
      toggleCalendar,
      selectedInfo,
      fetchScheduleByDate,
      updateCourt,
      updatePrice,
      onDateChange,
    };
  },
};
</script>

<style scoped>
/* CSS giữ nguyên */
</style>

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

.table-san {
  margin: 0px 10px 0px 10px;
}

.table-san h1 {
  font-size: 30px;
  font-weight: 500;
  padding: 10px;
}
</style>
