<template>
  <div class="field-management">
    <h1>Quản lý sân</h1>
    <n-button type="success" class="float-right mb-2" @click="openDrawer('create')">
      <template #icon>
        <n-icon><AddOutline /></n-icon>
      </template>
      Thêm mới
    </n-button>
    <n-data-table :columns="columns" :data="tableData" :pagination="pagination" />
    <field-drawer
      :open="drawerOpen"
      :mode="drawerMode"
      :detail-data="rowData"
      @success="() => fetchProductData()"
      @close="drawerOpen = false"
    />
  </div>
</template>

<script setup>
import { h, ref, onMounted } from 'vue';
import axios from 'axios';
import { NButton, NIcon, NPopconfirm, useMessage } from 'naive-ui';
import { Eye, CreateOutline, TrashOutline, AddOutline } from '@vicons/ionicons5';

import FieldDrawer from './FieldManagementDrawer.vue';

const message = useMessage();

const userData = JSON.parse(sessionStorage.getItem('userData'));
const tableData = ref([
  {
    key: 0,
    name: 'John Brown',
    area: 'Hà Nội',
    address: 'New York No. 1 Lake Park',
    price: '400.000 vnđ'
  }
]);

const drawerOpen = ref(false);
const drawerMode = ref('');
const rowData = ref();

function openDrawer(mode, data) {
  console.log('🚀 ~ openDrawer ~ data:', data);
  drawerOpen.value = true;
  drawerMode.value = mode;
  rowData.value = data;
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
    title: 'Giá',
    key: 'price'
  },
  {
    title: 'Số người',
    key: 'playerNum'
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
              onClick: () => openDrawer('detail', row)
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
              onClick: () => openDrawer('edit', row)
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
              default: () => 'Bạn có chắc chắn xóa sân?',
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

const pagination = {
  pageSize: 10
};

const deleteField = async row => {
  try {
    await axios.delete(`http://localhost:5000/api/field/${row._id}`);
    message.success('Xóa sân thành công');
    await fetchProductData();
  } catch (error) {
    console.error(error);
  }
};

const fetchProductData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/field');
    tableData.value = response.data.filter(field => field.ownedBy === userData.email);
    console.log('Email từ sessionStorage:', userData.email);
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await fetchProductData();
});
</script>

<style lang="scss" scoped>
.field-management {
  min-height: 550px;
  padding: 15px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  font-family: Arial, sans-serif;
  text-align: center;

  h1 {
    padding: 20px 10px;
    font-size: 30px;
    font-weight: 500;
  }
}
</style>
