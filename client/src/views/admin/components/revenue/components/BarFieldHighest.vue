<template>
  <div class="w-full h-full flex flex-col">
    <n-spin :show="loading">
      <n-grid cols="1 l:2" responsive="screen" x-gap="10" y-gap="10" class="w-full items-center mb-4">
        <n-gi :span="1">
          <span class="text-lg font-[500]"> Biểu đồ 5 sân được đặt nhiều nhất</span>
        </n-gi>
        <n-gi :span="1">
          <SelectMonthYear @time-change="onTimeChange" />
        </n-gi>
      </n-grid>
      <Bar v-if="!emptyChart" id="my-chart-id" :options="chartOptions" :data="chartData" class="w-full max-h-[300px]" />
    </n-spin>
    <div v-if="emptyChart" class="h-full flex flex-col justify-center">
      <n-empty description="Không có dữ liệu" class="" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

import { RevenueApi } from '@/api';

import SelectMonthYear from './SelectMonthYear.vue';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const mostBookedFields = ref([]);
const loading = ref(false);

const onTimeChange = async time => {
  try {
    loading.value = true;
    const res = await RevenueApi.getMostBookedFields(time);
    mostBookedFields.value = res;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const emptyChart = computed(() => !mostBookedFields.value?.length);

const chartData = computed(() => {
  const labels = mostBookedFields.value.map(field => field.fieldName);
  const data = mostBookedFields.value.map(field => field.bookedTimes);
  return {
    labels: labels,
    datasets: [
      {
        axis: 'y',
        data: data,
        label: '',
        fill: false,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)'
        ],
        borderWidth: 1
      }
    ]
  };
});
const chartOptions = {
  indexAxis: 'y',
  responsive: true,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Số lần đặt',
        align: 'start'
      },
      ticks: {
        precision: 0
      }
    }
  }
};
</script>
