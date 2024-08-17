<template>
  <div>
    <div class="flex justify-between b">
      <p class="text-[30px] font-medium">
        {{ `${detailData.name} từ ${formatDateVn(detailData.dateFrom)} đến ${formatDateVn(detailData.dateTo)}` }}
      </p>
      <div>
        <n-button @click="emits('close')">
          <template #icon>
            <n-icon><CloseOutline /></n-icon>
          </template>
          Đóng
        </n-button>
      </div>
    </div>
    <n-divider class="!my-3" />
    <div v-for="(schedule, index) in schedules">
      <div class="text-lg font-bold pb-2">
        Ngày {{ formatDateVn(formatQueryDate(schedule.date)) }}, đã đặt: {{ getBookedNum(schedule.slots) }}
      </div>
      <n-data-table :columns="getColumn(index)" :data="schedule.slots" :pagination="paginations[index]" />
    </div>
  </div>
</template>

<script setup>
import { computed, h, ref, onMounted } from 'vue';
import { CloseOutline } from '@vicons/ionicons5';
import axios from 'axios';
import { NButton, NIcon, useLoadingBar } from 'naive-ui';

import { formatDateVn, formatQueryDate } from '@/utils/common';
import { getPagination } from '@/utils/pagination';

const props = defineProps({
  detailData: Object
});
const emits = defineEmits(['close']);

const schedules = ref([]);

const loadingBar = useLoadingBar();

const paginations = computed(() => {
  return Array.from(schedules.value, _schedule =>
    getPagination(6, [
      {
        label: '6 / trang',
        value: 6
      },
      {
        label: '10 / trang',
        value: 10
      },
      {
        label: '20 / trang',
        value: 20
      }
    ])
  );
});

const getColumn = index => {
  return [
    {
      title: 'STT',
      render: (_rowData, rowIndex) =>
        rowIndex + (paginations.value[index]?.page - 1) * paginations.value[index]?.pageSize + 1,
      width: 60
    },
    { title: 'Khung giờ', key: 'hour', minWidth: 120 },
    {
      title: 'Trạng thái',
      key: 'status',
      sorter: 'default',
      minWidth: 120,
      render: rowData => {
        return h(
          'div',
          {
            style:
              rowData.status === 'available'
                ? { color: 'green', fontWeight: 'bold' }
                : { color: 'red', fontWeight: 'bold' }
          },
          rowData.status === 'available' ? 'Còn trống' : 'Đã đặt'
        );
      }
    },
    { title: 'Đặt bởi', key: 'bookedBy', sorter: 'default', minWidth: 120 }
  ];
};

const getBookedNum = slots => {
  return slots?.filter(slot => slot?.status === 'booked')?.length;
};

onMounted(async () => {
  try {
    loadingBar.start();
    const params = {
      fieldId: props.detailData.id,
      dateFrom: props.detailData.dateFrom,
      dateTo: props.detailData.dateTo
    };
    const res = await axios.get('http://localhost:5000/api/schedule/get-schedules-by-field/', { params });
    schedules.value = res.data;
  } catch (error) {
    console.log('🚀 ~ onMounted ~ error:', error);
  } finally {
    loadingBar.finish();
  }
});
</script>
