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
        <n-form-item-gi :span="1" path="name" label="Tên sân">
          <n-input v-if="!detailMode" v-model:value="formModel.name" placeholder="Tên sân" />
          <span v-else>{{ formModel.name }}</span>
        </n-form-item-gi>
        <n-form-item-gi :span="1" path="address" label="Địa chỉ">
          <n-input v-if="!detailMode" v-model:value="formModel.address" placeholder="Địa chỉ" />
          <span v-else>{{ formModel.address }}</span>
        </n-form-item-gi>
        <n-form-item-gi :span="1" path="area" label="Thuộc khu vực">
          <n-select
            v-if="!detailMode"
            v-model:value="formModel.area"
            placeholder="Thuộc khu vực"
            :options="areaList"
            clearable
          />
          <span v-else>{{ formModel.area }}</span>
        </n-form-item-gi>
        <n-form-item-gi :span="1" path="price" label="Giá">
          <n-input-number v-if="!detailMode" v-model:value="formModel.price" :show-button="false" placeholder="Giá">
            <template #suffix>VNĐ</template>
          </n-input-number>
          <span v-else>{{ formatMoney(formModel.price) }}</span>
        </n-form-item-gi>
        <n-form-item-gi :span="1" path="playerNum" label="Số người">
          <n-input v-if="!detailMode" v-model:value="formModel.playerNum" placeholder="Số người" />
          <span v-else>{{ formModel.playerNum }}</span>
        </n-form-item-gi>
        <n-form-item-gi :span="2" path="description.facilities" label="Cơ sở vật chất">
          <n-input
            v-if="!detailMode"
            v-model:value="formModel.description.facilities"
            placeholder="Cơ sở vật chất"
            type="textarea"
            :rows="2"
          />
          <span v-else>{{ formModel.description.facilities }}</span>
        </n-form-item-gi>
        <n-form-item-gi :span="2" path="description.transportation" label="Phương tiện di chuyển">
          <n-input
            v-if="!detailMode"
            v-model:value="formModel.description.transportation"
            placeholder="Phương tiện di chuyển"
            type="textarea"
            :rows="2"
          />
          <span v-else>{{ formModel.description.transportation }}</span>
        </n-form-item-gi>

        <n-form-item-gi :span="2" path="avatar" label="Ảnh đại diện sân (1 ảnh)">
          <n-space vertical :wrap="false">
            <n-upload
              v-if="!detailMode"
              v-model:file-list="formModel.avatar"
              :default-upload="false"
              :on-update:file-list="handleUploadAvatar"
              list-type="image-card"
              file-list-class="!flex flex-row"
              :max="1"
            >
              <n-button size="small">Chọn ảnh</n-button>
            </n-upload>
            <img
              v-if="detailMode || (mode === 'edit' && formModel.avatar?.length === 0)"
              :src="getImgUrl(formModel.avatarSrc)"
              style="max-width: 200px; object-fit: contain"
            />
          </n-space>
        </n-form-item-gi>

        <n-form-item-gi :span="2" path="image" label="Ảnh chi tiết sân (max 3 ảnh)">
          <n-space vertical :wrap="false">
            <n-upload
              v-if="!detailMode"
              v-model:file-list="detailImages"
              :default-upload="false"
              list-type="image-card"
              file-list-class="!flex flex-row"
              multiple
              :max="3"
              :on-update:file-list="handleUploadDetailImg"
            >
              <n-button size="small">Chọn ảnh</n-button>
            </n-upload>
            <div v-if="detailMode || (mode === 'edit' && detailImages.length === 0)" class="flex flex-row">
              <img
                v-for="imageSrc in detailImagesSrc"
                :src="getImgUrl(imageSrc)"
                style="max-width: 200px; margin: 2px; object-fit: contain"
              />
            </div>
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
import { cloneDeep, last, omit } from 'lodash';
import { SaveOutline, CloseOutline } from '@vicons/ionicons5';

import { areaList } from '@/utils/constant';
import { formatMoney, getImgUrl } from '@/utils/common';

const props = defineProps({
  mode: { type: String, default: 'create' },
  detailData: Object
});
const emits = defineEmits(['success', 'close']);

const message = useMessage();
const formInit = {
  name: '',
  address: '',
  area: undefined,
  price: '',
  playerNum: '',
  description: {
    facilities: '',
    transportation: ''
  },
  avatar: [],
  avatarSrc: '',
  detailImgSrc: []
};

const formRef = ref(null);
const formModel = ref(cloneDeep(formInit));
const detailImages = ref([]);
const loading = ref(false);

const rules = {
  name: [{ required: true, message: 'Thông tin bắt buộc', trigger: ['change', 'blur'] }],
  avatar: [{ required: true, message: 'Thông tin bắt buộc', type: 'array', trigger: ['change', 'blur'] }]
};

const title = computed(() => {
  return props.mode === 'detail' ? 'Chi tiết sân' : props.mode === 'create' ? 'Thêm mới sân' : 'Sửa thông tin sân';
});

const detailMode = computed(() => props.mode === 'detail');

const detailImagesSrc = computed(() => {
  if (!formModel.value.detailImgSrc) return [];
  return JSON.parse(formModel.value.detailImgSrc.replaceAll('\\', ''));
});

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
};

const handleUploadDetailImg = fileListData => {
  console.log('🚀 ~ handleUploadDetailImg ~ fileListData:', fileListData);
  const file = last(fileListData)?.file;
  if (file) {
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      message.error('Kích thước tệp quá lớn. Vui lòng chọn một tệp nhỏ hơn 5MB.');
      return;
    }
    detailImages.value = fileListData;
  } else {
    detailImages.value = [];
  }
};

const handleSave = () => {
  formRef.value
    ?.validate(async errors => {
      if (errors) return;
      loading.value = true;

      try {
        const formData = new FormData();
        const formValues = omit(formModel.value, ['avatar', 'avatarSrc', 'detailImgSrc']);
        formData.append('fieldData', JSON.stringify(formModel.value));
        if (formModel.value.avatar?.[0]) formData.append('images', formModel.value.avatar[0].file);
        detailImages.value.forEach(image => {
          formData.append('images', image?.file);
        });

        if (props.mode === 'create') {
          await axios.post('http://localhost:5000/api/field', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          message.success('Thêm mới sân thành công');
        } else {
          await axios.put(`http://localhost:5000/api/field/${props.detailData?._id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          message.success('Sửa thông tin sân thành công');
        }
        emits('success');
        handleClose();
      } catch (error) {
        const errMess = props.mode === 'create' ? 'Lỗi khi lưu sân bóng mới' : 'Lỗi khi sửa sân bóng';
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
  detailImages.value = [];
  emits('close');
};

watch(
  () => props.detailData,
  val => {
    console.log('🚀 ~ props.detailData:', props.detailData);
    if (val && props.mode !== 'create')
      formModel.value = {
        name: val?.name,
        address: val?.address,
        area: val?.area,
        price: val?.price?.toString(),
        playerNum: val?.playerNum?.toString(),
        description: {
          facilities: val?.description?.facilities,
          transportation: val?.description?.transportation
        },
        avatar: [],
        avatarSrc: val?.avatarSrc,
        detailImgSrc: val?.detailImgSrc
      };
  },
  {
    immediate: true,
    deep: true
  }
);
</script>
