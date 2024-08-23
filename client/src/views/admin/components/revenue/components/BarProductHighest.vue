<template>
  <div class="w-full h-full flex flex-col">
    <n-spin :show="loading">
      <n-grid cols="1 l:2" responsive="screen" x-gap="10" y-gap="10" class="w-full items-center mb-4">
        <n-gi :span="1">
          <span class="text-lg font-[500]">Biểu đồ 5 sản phẩm doanh thu cao nhất</span>
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
import { formatMoney } from '@/utils/common';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const top5Products = ref([]);
const loading = ref(false);

const onTimeChange = async time => {
  try {
    loading.value = true;
    const res = await RevenueApi.getTopFiveProducts(time);
    top5Products.value = res;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const emptyChart = computed(() => !top5Products.value?.length);

const chartData = computed(() => {
  const labels = top5Products.value.map(product => product.productName);
  const data = top5Products.value.map(product => product.totalIncome);
  return {
    labels: labels,
    datasets: [
      {
        axis: 'y',
        data: data,
        label: '',
        fill: false,
        backgroundColor: [
          'rgba(255, 99, 132)',
          'rgba(255, 159, 64)',
          'rgba(255, 205, 86)',
          'rgba(75, 192, 192)',
          'rgba(54, 162, 235)',
          'rgba(153, 102, 255)'
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
    },
    tooltip: {
      titleSpacing: 5,
      bodySpacing: 10,
      callbacks: {
        afterBody: function (toolTipItem) {
          const item = top5Products.value?.[toolTipItem[0].dataIndex];
          return [`Giá ${formatMoney(item?.price)} / chiếc`, `Bán tổng ${item?.quantity} chiếc`];
        }
      }
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Doanh thu (VNĐ)',
        align: 'start'
      },
      ticks: {
        precision: 0,
        stepSize: 1000000
      },
      beforeBuildTicks: function (axis) {
        if (axis.max >= 50000000) {
          axis.options.ticks.stepSize = 10000000;
        } else if (axis.max >= 30000000) {
          axis.options.ticks.stepSize = 5000000;
        } else if (axis.max >= 10000000) {
          axis.options.ticks.stepSize = 2000000;
        }
      }
    }
  }
};
</script>
