<template>
  <div>
    <div class="flex justify-between b">
      <p class="text-[20px] font-medium">{{ title }}</p>
      <div>
        <n-button v-if="!detailMode" type="success" :disabled="loading" class="!mr-2" @click="handleSave">
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
    <n-form ref="formRef" :model="formModel" :rules="!detailMode ? rules : {}" class="w-full">
      <n-grid cols="1 m:4" responsive="screen" :x-gap="10">
        <n-form-item-gi :span="2" path="name" label="Tên sản phẩm">
          <n-input v-if="!detailMode" v-model:value="formModel.name" placeholder="Tên sản phẩm" />
          <span v-else>{{ formModel.name }}</span>
        </n-form-item-gi>

        <n-form-item-gi :span="2" path="price" label="Giá">
          <n-input-number
            v-if="!detailMode"
            v-model:value="formModel.price"
            :show-button="false"
            placeholder="Giá"
            class="w-full"
          >
            <template #suffix>VNĐ</template>
          </n-input-number>
          <span v-else>{{ formatMoney(formModel.price) }}</span>
        </n-form-item-gi>

        <n-form-item-gi :span="2" path="sizes" label="Kích cỡ">
          <n-select
            v-if="!detailMode"
            v-model:value="formModel.sizes"
            placeholder="Kích cỡ"
            multiple
            :options="productSizes"
            clearable
          />
          <span v-else>{{ arrayToText(formModel.sizes) }}</span>
        </n-form-item-gi>

        <n-form-item-gi :span="2" path="colors" label="Màu sắc">
          <n-select
            v-if="!detailMode"
            v-model:value="formModel.colors"
            placeholder="Màu sắc"
            multiple
            :options="productColors"
            clearable
          />
          <span v-else>{{ arrayToText(formModel.colors) }}</span>
        </n-form-item-gi>

        <n-form-item-gi :span="2" path="type" label="Thuộc loại">
          <n-select
            v-if="!detailMode"
            v-model:value="formModel.type"
            placeholder="Thuộc loại"
            :options="productTypes"
            clearable
          />
          <span v-else>{{ formModel.type }}</span>
        </n-form-item-gi>

        <n-form-item-gi :span="2" path="description" label="Mô tả">
          <n-input
            v-if="!detailMode"
            v-model:value="formModel.description"
            placeholder="Mô tả"
            type="textarea"
            :rows="2"
          />
          <span v-else>{{ formModel.description }}</span>
        </n-form-item-gi>

        <n-form-item-gi :span="2" path="avatar" label="Ảnh đại diện (1 ảnh)">
          <n-space vertical :wrap="false">
            <n-upload
              v-if="!detailMode"
              v-model:file-list="formModel.avatar"
              :default-upload="false"
              :on-update:file-list="handleUploadAvatar"
              list-type="image-card"
              file-list-class="!flex flex-row !h-[200px]"
              :max="1"
            >
              <n-button size="small">Chọn ảnh</n-button>
            </n-upload>
            <img
              v-if="detailMode"
              :src="getImgUrl(formModel.avatarSrc)"
              style="max-width: 500px; object-fit: contain"
            />
          </n-space>
        </n-form-item-gi>
      </n-grid>
    </n-form>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useMessage } from 'naive-ui';
import axios from 'axios';
import { cloneDeep, omit } from 'lodash';
import { SaveOutline, CloseOutline } from '@vicons/ionicons5';

import { productTypes, productColors, productSizes } from '@/utils/constant';
import { formatMoney, getImgUrl } from '@/utils/common';

const props = defineProps({
  mode: { type: String, default: 'create' },
  detailData: Object
});
const emits = defineEmits(['success', 'close']);

const message = useMessage();
const formInit = {
  name: '',
  type: undefined,
  price: undefined,
  colors: undefined,
  sizes: undefined,
  description: '',
  avatar: [],
  avatarSrc: ''
};

const formRef = ref(null);
const formModel = ref(cloneDeep(formInit));
const loading = ref(false);

const rules = {
  name: [{ required: true, message: 'Thông tin bắt buộc', trigger: ['change', 'blur'] }],
  type: [{ required: true, message: 'Thông tin bắt buộc', trigger: ['change', 'blur'] }],
  price: [{ required: true, message: 'Thông tin bắt buộc', type: 'number', trigger: ['change', 'blur'] }],
  sizes: [{ required: true, message: 'Thông tin bắt buộc', type: 'array', trigger: ['change', 'blur'] }],
  colors: [{ required: true, message: 'Thông tin bắt buộc', type: 'array', trigger: ['change', 'blur'] }],
  avatar: [{ required: true, message: 'Thông tin bắt buộc', type: 'array', trigger: ['change', 'blur'] }]
};

const title = computed(() => {
  return props.mode === 'detail'
    ? 'Chi tiết sản phẩm'
    : props.mode === 'create'
      ? 'Thêm mới sản phẩm'
      : 'Sửa thông tin sản phẩm';
});

const detailMode = computed(() => props.mode === 'detail');

const handleUploadAvatar = fileListData => {
  const file = fileListData[0]?.file;
  if (file) {
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      message.error('Kích thước tệp quá lớn. Vui lòng chọn một tệp nhỏ hơn 5MB.');
      formModel.value.avatar = [];
      return;
    }
    formModel.value.avatar = fileListData;
  } else {
    formModel.value.avatar = [];
  }
  formRef.value?.validate().catch(() => {});
};

const handleSave = () => {
  formRef.value
    ?.validate(async errors => {
      if (errors) return;
      loading.value = true;

      try {
        const formData = new FormData();
        const formValues = omit(formModel.value, ['avatar', 'avatarSrc']);
        formValues.colors = JSON.stringify(formValues.colors);
        formValues.sizes = JSON.stringify(formValues.sizes);
        formData.append('productData', JSON.stringify(formValues));
        if (formModel.value.avatar?.[0]) formData.append('image', formModel.value.avatar[0].file);

        if (props.mode === 'create') {
          await axios.post('http://localhost:5000/api/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          message.success('Thêm mới sản phẩm thành công');
        } else {
          await axios.put(`http://localhost:5000/api/products/${props.detailData?._id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          message.success('Sửa thông tin sản phẩm thành công');
        }
        emits('success');
        handleClose();
      } catch (error) {
        const errMess = props.mode === 'create' ? 'Lỗi khi lưu sản phẩm mới' : 'Lỗi khi sửa sản phẩm';
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

const parseArray = JSONstring => {
  if (!JSONstring) return '';
  return JSON.parse(JSONstring.replaceAll('\\', ''));
};

const arrayToText = array => {
  if (!array || !Array.isArray(array)) return ''
  return array.join(', ')
}

watch(
  () => props.detailData,
  val => {
    if (val && props.mode !== 'create')
      formModel.value = {
        name: val?.name,
        type: val?.type,
        price: val?.price,
        sizes: parseArray(val?.sizes),
        colors: parseArray(val?.colors),
        description: val?.description,
        avatar: [],
        avatarSrc: val?.imageSrc
      };
    if (val?.imageSrc) {
      formModel.value.avatar.push({
        id: 'image',
        status: 'finished',
        url: getImgUrl(val?.imageSrc)
      });
    }
  },
  {
    immediate: true,
    deep: true
  }
);
</script>

<style scoped lang="scss">
:deep(.n-upload-file-list .n-upload-file.n-upload-file--image-card-type) {
  width: 200px;
  height: 200px;
}
:deep(.n-upload-trigger.n-upload-trigger--image-card) {
  width: 200px;
  height: 200px;
}
</style>
