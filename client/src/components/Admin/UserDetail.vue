<template>
  <div>
    <div class="flex justify-between b">
      <p class="text-[20px] font-medium">{{ title }}</p>
      <div>
        <n-button v-if="!detailMode" type="success" :disabled="loading" class="mr-2" @click="handleSave">
          <template #icon>
            <n-icon><SaveOutline /></n-icon>
          </template>
          Lưu
        </n-button>
        <n-button :disabled="loading" @click="handleClose">
          <template #icon>
            <n-icon><CloseOutline /></n-icon>
          </template>
          Đóng
        </n-button>
      </div>
    </div>
    <n-divider class="!my-3" />

    <n-form ref="formRef" size="small" :model="formModel" :rules="!detailMode ? rules : {}" class="w-full">
      <n-grid cols="2 md:1" responsive="screen" :x-gap="10">
        <n-form-item-gi :span="1" path="email" label="Email">
          <n-input v-if="!detailMode" v-model:value="formModel.email" :disabled="editMode" placeholder="Email" />
          <span v-else>{{ formModel.email }}</span>
        </n-form-item-gi>
        <n-form-item-gi :span="1" path="role" label="Vai trò">
          <n-select
            v-if="!detailMode"
            v-model:value="formModel.role"
            :disabled="editMode"
            :options="roleList"
            placeholder="Vai trò"
          />
          <span v-else>{{ formModel.role }}</span>
        </n-form-item-gi>
        <n-form-item-gi :span="1" path="phone" label="Số điện thoại">
          <n-input v-if="!detailMode" v-model:value="formModel.phone" placeholder="Số điện thoại" />
          <span v-else>{{ formModel.phone }}</span>
        </n-form-item-gi>
        <n-form-item-gi :span="1" path="fullName" label="Họ và tên">
          <n-input v-if="!detailMode" v-model:value="formModel.fullName" placeholder="Họ và tên" />
          <span v-else>{{ formModel.fullName }}</span>
        </n-form-item-gi>
      </n-grid>
    </n-form>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import axios from 'axios';
import { cloneDeep, last, omit } from 'lodash';
import { SaveOutline, CloseOutline } from '@vicons/ionicons5';

const props = defineProps({
  mode: { type: String, default: 'create' },
  userId: String
});
const emits = defineEmits(['success', 'close']);

const roleList = [
  {
    label: 'Admin',
    value: 'admin'
  },
  {
    label: 'User',
    value: 'user'
  }
];

const message = useMessage();
const formInit = {
  email: '',
  role: undefined,
  phone: '',
  fullName: ''
};

const formRef = ref(null);
const formModel = ref(cloneDeep(formInit));
const loading = ref(false);

const rules = {
  email: [{ required: true, message: 'Thông tin bắt buộc', trigger: ['change', 'blur'] }],
  role: [{ required: true, message: 'Thông tin bắt buộc', trigger: ['change', 'blur'] }]
};

const title = computed(() => {
  return props.mode === 'detail'
    ? 'Chi tiết người dùng'
    : props.mode === 'create'
      ? 'Thêm mới người dùng (mật khẩu mặc định 123456)'
      : 'Sửa thông tin người dùng';
});

const detailMode = computed(() => props.mode === 'detail');
const editMode = computed(() => props.mode === 'edit');

const handleSave = () => {
  formRef.value
    ?.validate(async errors => {
      if (errors) return;
      loading.value = true;

      try {
        if (props.mode === 'create') {
          await axios.post('http://localhost:5000/api/users', formModel.value);
          message.success('Thêm mới người dùng thành công');
        } else {
          await axios.put(`http://localhost:5000/api/users/${props.userId}`, formModel.value);
          message.success('Sửa thông tin người dùng thành công');
        }
        emits('success');
        handleClose();
      } catch (error) {
        const errMess = props.mode === 'create' ? 'Lỗi khi lưu người dùng mới' : 'Lỗi khi sửa người dùng';
        console.error(errMess, error);
        message.error(error?.response?.data?.message || errMess);
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {});
};

const handleClose = () => {
  formModel.value = formInit;
  emits('close');
};

watch(
  () => props.userId,
  async val => {
    if (val && props.mode !== 'create') {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${val}`);
        formModel.value = {
          email: res?.data?.email,
          role: res?.data?.role,
          phone: res?.data?.phone,
          fullName: res?.data?.fullName
        };
      } catch (error) {}
    }
  },
  {
    immediate: true
  }
);
</script>
