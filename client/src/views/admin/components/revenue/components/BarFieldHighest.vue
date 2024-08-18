<template>
  <div class="w-full h-full">
    <n-grid cols="1 l:2" responsive="screen" x-gap="10" y-gap="10" class="w-full items-center mb-4">
      <n-gi :span="1">
        <span class="text-lg font-[500]">Biểu đồ 5 sân có doanh thu cao nhất</span>
      </n-gi>
      <n-gi :span="1">
        <SelectMonthYear />
      </n-gi>
    </n-grid>
    <Bar id="my-chart-id" :options="chartOptions" :data="chartData" class="w-full max-h-[300px]" />
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

import SelectMonthYear from './SelectMonthYear.vue';

import { ref } from 'vue';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const chartData = {
  labels: ['Sân Mỹ Đình', 'Sân Hàng Đẫy', 'Sân Gò Đậu', 'Sân Mai Dịch', 'Sân Bộ Công An'],
  datasets: [
    {
      axis: 'y',
      data: [100, 92, 85, 81, 56, 55, 40],
      label: '',
      fill: false,

      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      borderWidth: 1
    }
  ]
};
const chartOptions = {
  indexAxis: 'y',
  responsive: true,
  plugins: {
    legend: {
      display: false
    }
  }
};
</script>
