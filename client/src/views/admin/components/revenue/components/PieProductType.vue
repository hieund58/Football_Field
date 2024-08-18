<template>
  <div class="w-full h-full">
    <n-grid cols="1 l:2" responsive="screen" x-gap="10" y-gap="10" class="w-full items-center mb-4">
      <n-gi :span="1">
        <span class="text-lg font-[500]">Biểu đồ doanh thu theo loại sản phẩm</span>
      </n-gi>
      <n-gi :span="1">
        <SelectMonthYear />
      </n-gi>
    </n-grid>
    <Pie :data="data" :options="options" class="w-full max-h-[300px]" />
  </div>
</template>

<script setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'vue-chartjs';

import SelectMonthYear from './SelectMonthYear.vue';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ['Quần Áo', 'Giày', 'Dụng cụ', 'Khác'],
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
      data: [40, 20, 80, 10]
    }
  ]
};

const options = {
  responsive: true
  // maintainAspectRatio: false
};
</script>
