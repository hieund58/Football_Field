<template>
  <div class="w-full h-full flex flex-col">
    <n-spin :show="loading">
      <n-grid cols="1 l:2" responsive="screen" x-gap="10" y-gap="10" class="w-full items-center mb-4">
        <n-gi :span="1">
          <span class="text-lg font-[500]">Biểu đồ doanh thu theo loại sản phẩm</span>
        </n-gi>
        <n-gi :span="1">
          <SelectMonthYear @time-change="onTimeChange" />
        </n-gi>
      </n-grid>
      <Pie v-if="!emptyChart" :data="data" :options="options" class="w-full max-h-[300px]" />
    </n-spin>
    <div v-if="emptyChart" class="h-full flex flex-col justify-center">
      <n-empty description="Không có dữ liệu" class="" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'vue-chartjs';

import { RevenueApi } from '@/api';
import { getNameByCode } from '@/utils/constant';


import SelectMonthYear from './SelectMonthYear.vue';

ChartJS.register(ArcElement, Tooltip, Legend);

const productTypesIncome = ref([]);
const backgroundColors = ref(['#41B883', '#E46651', '#00D8FF', '#DD1B16']);
const loading = ref(false);

const onTimeChange = async time => {
  try {
    loading.value = true;
    const res = await RevenueApi.getProductIncomeByType(time);
    productTypesIncome.value = res.map(item => ({
      name: getNameByCode('productType', item.type),
      totalIncome: item.totalIncome
    }));
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const emptyChart = computed(() => !productTypesIncome.value?.length);

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const data = computed(() => {
  const labels = productTypesIncome.value.map(type => type.name);
  const data = productTypesIncome.value.map(type => type.totalIncome);
  return {
    labels: labels,
    datasets: [
      {
        backgroundColor: backgroundColors.value,
        data: data
      }
    ]
  };
});

const options = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        afterLabel: function () {
          return 'VNĐ';
        }
      },
    }
  }
  //   maintainAspectRatio: false
};

watch(
  () => productTypesIncome.value,
  val => {
    if (val.length > 4 && backgroundColors.value.length !== val.length) {
      for (let i = 0; i < val.length - 4; i++) {
        backgroundColors.value.push(getRandomColor());
      }
    }
  }
);
</script>
