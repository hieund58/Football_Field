<template>
  <div class="field-management">
    <Transition name="fade" :duration="300" mode="out-in">
      <div v-if="!detailOpened">
        <h1>Trạng thái đặt sân</h1>
        <n-input-group class="mb-2">
          <n-date-picker v-model:value="searchDateRange" type="daterange" format="dd-MM-yyyy" class="!w-[300px]" />
          <n-input v-model:value="searchInput" placeholder="Tìm theo tên sân" clearable class="!w-[200px]" />
          <n-button ghost @click="handleSearch">
            <template #icon>
              <n-icon><SearchOutline /></n-icon>
            </template>
          </n-button>
          <n-button ghost @click="handleReset">
            <template #icon>
              <n-icon><ReloadOutline /></n-icon>
            </template>
          </n-button>
        </n-input-group>
        <n-data-table :columns="columns" :data="tableData" :pagination="pagination" />
      </div>

      <BookingManagementDetail
          v-else-if="detailOpened"
          :detail-data="rowData"
          @success="() => fetchProductData()"
          @close="detailOpened = false"
        />
    </Transition>
  </div>
</template>

<script setup>
import { h, ref, onMounted } from 'vue';
import { DateTime } from 'luxon';
import axios from 'axios';
import { NButton, NIcon, NPopconfirm, useMessage, useLoadingBar } from 'naive-ui';
import { Eye, CreateOutline, TrashOutline, AddOutline, SearchOutline, ReloadOutline } from '@vicons/ionicons5';

import { formatDateVn, formatQueryDate } from '@/utils/common';

import BookingManagementDetail from './BookingManagementDetail.vue';

const message = useMessage();
const loadingBar = useLoadingBar();

const userData = JSON.parse(sessionStorage.getItem('userData'));
const tableData = ref([]);

const detailOpened = ref(false);
const rowData = ref();
const searchInput = ref('');
const searchDateRange = ref([DateTime.now().minus({ days: 7 }).toJSDate(), DateTime.now().toJSDate()]);

function openDetail(data) {
  detailOpened.value = true;
  rowData.value = {
    ...data,
    dateFrom: formatQueryDate(searchDateRange.value[0]),
    dateTo: formatQueryDate(searchDateRange.value[1])
};
}

function renderIcon(icon) {
  return h(NIcon, null, {
    default: () => h(icon)
  });
}

const columns = [
  {
    title: 'Tên sân',
    key: 'name'
  },
  {
    title: 'Địa Chỉ',
    key: 'address'
  },
  {
    title: 'Khu vực',
    key: 'area'
  },
  {
    title: 'Số ngày sân được đặt',
    key: 'numOfBookedDays'
  },
  {
    title: 'Số buổi sân được đặt',
    key: 'numOfBookedSlots'
  },
  {
    title: 'Thao tác',
    fixed: 'right',
    align: 'center',
    width: '100',
    key: 'actions',
    render(row) {
      return h('div', null, [
        h(
          NButton,
          {
            type: 'info',
            ghost: true,
            circle: true,
            size: 'small',
            title: 'Chi tiết',
            style: { marginRight: '2px' },
            renderIcon: () => renderIcon(Eye),
            onClick: () => openDetail(row)
          },
          null
        )
      ]);
    }
  }
];

const pagination = {
  pageSize: 10
};

const fetchProductData = async () => {
  try {
    loadingBar.start();
    const params = {
      fieldName: searchInput.value,
      dateFrom: formatQueryDate(searchDateRange.value[0]),
      dateTo: formatQueryDate(searchDateRange.value[1])
    };
    const response = await axios.get('http://localhost:5000/api/field/fields-and-schedules/', { params });
    tableData.value = response.data;
    console.log('Email từ sessionStorage:', userData.email);
  } catch (error) {
    console.error(error);
    message.error(error?.response?.data?.message);
  } finally {
    loadingBar.finish();
  }
};

const handleSearch = () => {
  //   if (!searchInput.value || !tableData.value?.length) ret
  fetchProductData();
};

const handleReset = () => {
  searchInput.value = '';
  searchDateRange.value = [DateTime.now().minus({ days: 7 }).toJSDate(), DateTime.now().toJSDate()];
  fetchProductData();
};

onMounted(async () => {
  await fetchProductData();
});
</script>

<style lang="scss" scoped>
.field-management {
  padding: 10px;
  font-family: Arial, sans-serif;

  h1 {
    font-size: 20px;
    font-weight: 500;
    padding-bottom: 10px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
