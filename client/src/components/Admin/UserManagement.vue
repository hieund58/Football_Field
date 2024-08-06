<template>
  <div class="field-management">
    <Transition name="fade" :duration="300" mode="out-in">
      <div v-if="!showDetail">
        <h1>Quản lý người dùng</h1>
        <div class="flex justify-between mb-2">
          <n-input-group>
            <n-input v-model:value="searchInput" placeholder="Tìm theo tên đăng nhập" class="!w-[200px]" />
            <n-button ghost @click="handleSearch">
              <template #icon>
                <n-icon><SearchOutline /></n-icon>
              </template>
            </n-button>
            <n-button ghost @click="resetSearch">
              <template #icon>
                <n-icon><ReloadOutline /></n-icon>
              </template>
            </n-button>
          </n-input-group>
          <n-button type="success" @click="showUserDetail('create')">
            <template #icon>
              <n-icon><AddOutline /></n-icon>
            </template>
            Thêm mới
          </n-button>
        </div>
        <n-data-table :columns="columns" :data="tableData" :pagination="pagination" />
      </div>

      <user-detail
        v-else-if="showDetail"
        :mode="detailMode"
        :user-id="rowId"
        @success="() => fetchUsers()"
        @close="showDetail = false"
      />
    </Transition>
  </div>
</template>

<script setup>
import { h, ref, onMounted } from 'vue';
import axios from 'axios';
import { NButton, NIcon, NPopconfirm, useMessage, useLoadingBar } from 'naive-ui';
import {
  Eye,
  CreateOutline,
  TrashOutline,
  AddOutline,
  SearchOutline,
  ReloadOutline,
  LockOpenOutline
} from '@vicons/ionicons5';

import UserDetail from './UserDetail.vue';

const message = useMessage();
const loadingBar = useLoadingBar();

const tableData = ref([]);
const showDetail = ref(false);
const detailMode = ref('');
const rowId = ref();
const searchInput = ref('');

function showUserDetail(mode, id) {
  showDetail.value = true;
  detailMode.value = mode;
  rowId.value = id;
}

function renderIcon(icon) {
  return h(NIcon, null, {
    default: () => h(icon)
  });
}

const columns = [
  {
    title: 'Tên đăng nhập/Email',
    key: 'email',
    minWidth: '90'
  },
  {
    title: 'Vai trò',
    key: 'role',
    minWidth: '90'
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
          style: { display: 'flex' }
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
              onClick: () => showUserDetail('detail', row?._id)
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
              onClick: () => showUserDetail('edit', row?._id)
            },
            null
          ),
          h(
            NPopconfirm,
            {
              positiveText: 'Có',
              negativeText: 'Không',

              onPositiveClick: () => resetPassword(row?._id),
              onNegativeClick: () => {}
            },
            {
              default: () => 'Bạn có chắc chắn đặt lại mật khẩu mặc định là 123456 cho người dùng này?',
              trigger: () =>
                h(
                  NButton,
                  {
                    type: 'info',
                    circle: true,
                    ghost: true,
                    size: 'small',
                    title: 'Đặt lại mật khẩu',
                    style: { marginRight: '2px' },
                    renderIcon: () => renderIcon(LockOpenOutline)
                  },
                  null
                )
            }
          ),
          row.role !== 'admin' &&
            h(
              NPopconfirm,
              {
                positiveText: 'Có',
                negativeText: 'Không',
                onPositiveClick: () => deleteUser(row?._id),
                onNegativeClick: () => {}
              },
              {
                default: () => 'Bạn có chắc chắn xóa người dùng?',
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

const deleteUser = async id => {
  try {
    await axios.delete(`http://localhost:5000/api/users/${id}`);
    message.success('Xóa người dùng thành công');
    await fetchUsers();
  } catch (error) {
    console.error(error);
    message.error(error?.response?.data?.message);
  }
};

const resetPassword = async id => {
  try {
    await axios.put(`http://localhost:5000/api/users/reset-password/${id}`);
    message.success('Đặt lại mật khẩu thành công');
    await fetchUsers();
  } catch (error) {
    console.error(error);
    message.error(error?.response?.data?.message);
  }
};

const fetchUsers = async () => {
  try {
    loadingBar.start();
    const response = await axios.get('http://localhost:5000/api/users');
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
  tableData.value = tableData.value.filter(row => row?.email?.toLowerCase()?.includes(searchInput.value.toLowerCase()));
};

const resetSearch = () => {
  searchInput.value = '';
  fetchUsers()
}

onMounted(async () => {
  await fetchUsers();
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
