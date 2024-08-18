<template>
  <div>
    <h1>Doanh thu đặt sân</h1>
    <n-grid cols="1 m:2" responsive="screen" :x-gap="20" :y-gap="20">
      <n-gi :span="1">
        <BarFieldHighest class="chart" />
      </n-gi>
      <n-gi :span="1">
        <PieFieldArea class="chart" />
      </n-gi>
    </n-grid>
    <h1 class="mt-3">Doanh thu bán sản phẩm</h1>
    <n-grid cols="1 m:2" responsive="screen" :x-gap="20" :y-gap="20">
      <n-gi :span="1">
        <BarProductHighest class="chart" />
      </n-gi>
      <n-gi :span="1">
        <PieProductType class="chart" />
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup>
import BarFieldHighest from './components/BarFieldHighest.vue';
import PieFieldArea from './components/PieFieldArea.vue';
import BarProductHighest from './components/BarProductHighest.vue';
import PieProductType from './components/PieProductType.vue';
</script>

<style>
h1 {
  font-size: 20px;
  font-weight: 500;
  padding-bottom: 10px;
}
.chart {
  border: 1px solid rgb(203, 203, 203);
  /* border: 1px solid rgb(98, 98, 98); */
  border-radius: 10px;
  padding: 20px;
}
</style>
