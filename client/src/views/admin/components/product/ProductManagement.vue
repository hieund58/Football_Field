<template>
  <div class="field-management">
    <Transition name="fade" :duration="300" mode="out-in">
      <div v-if="!detailOpenned">
        <h1>Quản lý sản phẩm</h1>
        <div class="flex justify-between mb-2">
          <n-input-group>
            <n-input v-model:value="searchInput" placeholder="Tìm theo tên sản phẩm" class="!w-[200px]" />
            <n-button ghost @click="handleSearch">
              <template #icon>
                <n-icon><SearchOutline /></n-icon>
              </template>
            </n-button>
            <n-button ghost @click="() => fetchProductData()">
              <template #icon>
                <n-icon><ReloadOutline /></n-icon>
              </template>
            </n-button>
          </n-input-group>
          <n-button type="success" @click="goDetail('create')">
            <template #icon>
              <n-icon><AddOutline /></n-icon>
            </template>
            Thêm mới
          </n-button>
        </div>
        <n-data-table :columns="columns" :data="tableData" :pagination="pagination" />
      </div>

      <ProductManagementDetail
        v-else
        :mode="detailMode"
        :detail-data="rowData"
        @success="() => fetchProductData()"
        @close="detailOpenned = false"
      />
    </Transition>
  </div>
</template>

<script setup>
import { h, ref, onMounted } from 'vue';
import axios from 'axios';
import { NButton, NIcon, NPopconfirm, useMessage, useLoadingBar } from 'naive-ui';
import { Eye, CreateOutline, TrashOutline, AddOutline, SearchOutline, ReloadOutline } from '@vicons/ionicons5';

import { formatMoney } from '@/utils/common';
import { getPagination } from '@/utils/pagination';
import { getNameByCode } from '@/utils/constant';

import ProductManagementDetail from './ProductManagementDetail.vue';

const message = useMessage();
const loadingBar = useLoadingBar();

const tableData = ref([]);

const detailOpenned = ref(false);
const detailMode = ref('');
const rowData = ref();
const searchInput = ref('');

function goDetail(mode, data) {
  detailOpenned.value = true;
  detailMode.value = mode;
  rowData.value = data;
}

function renderIcon(icon) {
  return h(NIcon, null, {
    default: () => h(icon)
  });
}

const pagination = getPagination();

const columns = [
  {
    title: 'STT',
    render: (_rowData, rowIndex) => rowIndex + (pagination.page - 1) * pagination.pageSize + 1,
    width: 60
  },
  {
    title: 'Tên sản phẩm',
    key: 'name'
  },
  {
    title: 'Thuộc loại',
    key: 'type',
    render: (rowData) => getNameByCode('productType', rowData.type)
  },
  {
    title: 'Số lượng',
    key: 'remaining',
    sorter: 'default'
  },
  {
    title: 'Giá',
    key: 'price',
    sorter: 'default',
    render(row) {
      return h('div', null, [formatMoney(row?.price)]);
    }
  },
  {
    title: 'Thao tác',
    fixed: 'right',
    width: '100',
    key: 'actions',
    render(row) {
      return h(
        'div',
        {
          style: { display: 'flex', justifyContent: 'space-between' }
        },
        [
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
              onClick: () => goDetail('detail', row)
            },
            null
          ),
          h(
            NButton,
            {
              type: 'info',
              circle: true,
              ghost: true,
              size: 'small',
              title: 'Sửa',
              style: { marginRight: '2px' },
              renderIcon: () => renderIcon(CreateOutline),
              onClick: () => goDetail('edit', row)
            },
            null
          ),
          h(
            NPopconfirm,
            {
              positiveText: 'Có',
              negativeText: 'Không',
              onPositiveClick: () => deleteField(row),
              onNegativeClick: () => {}
            },
            {
              default: () => 'Bạn có chắc chắn xóa sản phẩm?',
              trigger: () =>
                h(
                  NButton,
                  {
                    type: 'error',
                    circle: true,
                    ghost: true,
                    size: 'small',
                    title: 'Xóa',
                    renderIcon: () => renderIcon(TrashOutline)
                  },
                  null
                )
            }
          )
        ]
      );
    }
  }
];

const deleteField = async row => {
  try {
    await axios.delete(`http://localhost:5000/api/products/${row._id}`);
    message.success('Xóa sản phẩm thành công');
    await fetchProductData();
  } catch (error) {
    console.error(error);
  }
};

const fetchProductData = async () => {
  try {
    loadingBar.start();
    const response = await axios.get('http://localhost:5000/api/products');
    tableData.value = response.data;
  } catch (error) {
    console.error(error);
    message.error(error?.response?.data?.message);
  } finally {
    loadingBar.finish();
  }
};

const handleSearch = () => {
  if (!searchInput.value || !tableData.value?.length) return;
  tableData.value = tableData.value.filter(row => row?.name?.toLowerCase()?.includes(searchInput.value.toLowerCase()));
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
