<template>
  <n-grid cols="1 s:2" responsive="screen" x-gap="10" y-gap="10">
    <n-gi :span="1">
      <n-select v-model:value="form.type" :options="options" size="small" />
    </n-gi>
    <n-gi :span="1">
      <n-date-picker
        v-if="showMonth"
        v-model:value="form.timestamp"
        type="month"
        format="MM/y"
        month-format="MMM"
        clearable
        size="small"
        :is-date-disabled="dateDisabled"
      />
      <n-date-picker v-else v-model:value="form.timestamp" type="year" clearable size="small" :is-date-disabled="dateDisabled"/>
    </n-gi>
  </n-grid>
</template>

<script setup>
import { ref, computed } from 'vue';
import { DateTime } from 'luxon';

const options = [
  { label: 'Tháng', value: 'month' },
  { label: 'Năm', value: 'year' }
];

function dateDisabled(ts) {
        const date = new Date(ts)
        return date > new Date()
      }

const form = ref({
  type: 'month',
  timestamp: DateTime.now().valueOf()
});

const showMonth = computed(() => form.value.type === 'month');
</script>
