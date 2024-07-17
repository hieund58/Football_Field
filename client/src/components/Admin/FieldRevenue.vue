<template>
  <div class="flex">
    <div class="w-1/5 bg-gray-800 h-screen">
      <div class="text-white p-4">
        <h2 class="text-xl font-bold">Trang chủ Admin</h2>
        <div class="user-info">
          <p>User: {{ getUsernameFromSession }}</p>
          <button @click="logout">Logout</button>
        </div>
      </div>
      <div class="my-4">
        <router-link
          to="/fields"
          class="block text-gray-300 hover:bg-gray-700 py-2 px-4"
        >
          Thống kê các sân bóng
        </router-link>
        <router-link
          to="/bookingDetail"
          class="block text-gray-300 hover:bg-gray-700 py-2 px-4"
        >
          Sân đang được đặt
        </router-link>
        <router-link
          to="/UserManager"
          class="block text-gray-300 hover:bg-gray-700 py-2 px-4"
        >
          Trạng thái người dùng
        </router-link>
        <router-link
          to="/revenue"
          class="block text-gray-300 hover:bg-gray-700 py-2 px-4"
        >
          Doanh Thu
        </router-link>
      </div>
    </div>

    <div class="w-4/5 bg-white p-4">
      <div>
        <h2>Biểu đồ doanh thu của sân bóng {{ name }}</h2>
        <n-date-picker
          v-model="selectedDate"
          :range="7"
          :max-date="maxDate"
        ></n-date-picker>
        <canvas ref="revenueChart"></canvas>
      </div>
      <div class="mt-4">
        <div class="flex justify-center">
          <button @click="prevWeek" class="mr-4">
            <font-awesome-icon icon="arrow-left" />
          </button>
          <button @click="nextWeek" class="ml-4">
            <font-awesome-icon icon="arrow-right" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Chart from "chart.js/auto";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      name: "",
      revenueData: [],
      selectedDate: new Date(),
      maxDate: new Date(),
      chartInstance: null,
    };
  },
  computed: {
    labels() {
      const labels = [];
      const startDate = new Date(this.selectedDate);
      for (let i = 0; i < 7; i++) {
        const labelDate = new Date(startDate);
        labelDate.setDate(labelDate.getDate() + i);
        labels.push(labelDate.toISOString().slice(0, 10)); // Chuyển thành định dạng ISO Date và cắt 10 ký tự đầu
      }
      return labels;
    },
  },
  created() {
    this.name = this.$route.params.name;
    this.fetchRevenueData();
  },
  watch: {
    selectedDate: "fetchRevenueData",
  },
  methods: {
    async fetchRevenueData() {
      const startDate = new Date(this.selectedDate);
      const endDate = new Date(this.selectedDate);
      endDate.setDate(endDate.getDate() + 7);

      try {
        const response = await axios.get(
          "http://localhost:5000/api/process-payment",
          {
            params: {
              start_date: startDate.toISOString().slice(0, 10), // Cắt 10 ký tự đầu
              end_date: endDate.toISOString().slice(0, 10), // Cắt 10 ký tự đầu
            },
          },
        );

        this.revenueData = response.data.filter(
          (item) => item.status === "Đã thanh toán" && item.name === this.name,
        );

        const dailyData = Array.from({ length: 7 }, () => 0);

        this.revenueData.forEach((item) => {
          const date = new Date(item.selectDate);
          const dayOfWeek = date.getDay();
          dailyData[dayOfWeek] += item.price;
        });

        const values = dailyData;

        if (this.chartInstance) {
          this.chartInstance.destroy();
        }

        const ctx = this.$refs.revenueChart;
        this.chartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels: this.labels,
            datasets: [
              {
                label: "Doanh thu",
                data: values,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                suggestedMin: 0,
                suggestedMax: 10000000,
                stepSize: 1000000,
              },
            },
            tooltips: {
              callbacks: {
                label: (tooltipItem) => {
                  return `Doanh thu: ${tooltipItem.yLabel}`;
                },
              },
            },
          },
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
      }
    },
    prevWeek() {
      const prevWeek = new Date(this.selectedDate);
      prevWeek.setDate(prevWeek.getDate() - 7);
      this.selectedDate = prevWeek;
    },
    nextWeek() {
      const nextWeek = new Date(this.selectedDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      this.selectedDate = nextWeek;
    },
  },
};
</script>
