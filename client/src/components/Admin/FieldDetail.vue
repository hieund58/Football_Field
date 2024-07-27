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
          <n-input v-if="!detailMode" v-model:value="formModel.price" placeholder="Giá" />
          <span v-else>{{ formModel.price }}</span>
        </n-form-item-gi>
        <n-form-item-gi :span="1" path="playerNum" label="Số người">
          <n-input v-if="!detailMode" v-model:value="formModel.playerNum" placeholder="Số người" />
          <span v-else>{{ formModel.playerNum }}</span>
        </n-form-item-gi>
        <n-form-item-gi :span="1" path="image" label="Ảnh sân">
          <n-space vertical :wrap="false">
            <n-upload
              v-if="!detailMode"
              v-model:file-list="fileList"
              :default-upload="false"
              @preview="showModalPreview = true"
              :on-update:file-list="handleUpload"
            >
              <n-button size="small">Chọn ảnh</n-button>
            </n-upload>
            <img
              v-if="detailMode || (mode === 'edit' && fileList.length === 0)"
              :src="`http://localhost:5000/${formModel.imageSrc}`"
              style="width: 100%"
            />
          </n-space>
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
      </n-grid>
    </n-form>
    <n-modal v-model:show="showModalPreview" preset="card" style="width: 600px" title="Xem ảnh vừa tải">
      <img :src="previewImageUrl" style="width: 100%" />
    </n-modal>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useMessage } from 'naive-ui';
import axios from 'axios';
import { cloneDeep } from 'lodash';
import { SaveOutline, CloseOutline } from '@vicons/ionicons5';

import { areaList } from '../../utils/constant';

const props = defineProps({
  mode: { type: String, default: 'create' },
  detailData: Object
});
const emits = defineEmits(['success', 'close']);

const message = useMessage();
const userData = JSON.parse(sessionStorage.getItem('userData'));
const formInit = {
  name: '',
  address: '',
  area: undefined,
  imageSrc: '',
  price: '',
  playerNum: '',
  description: {
    facilities: '',
    transportation: ''
  }
};

const formRef = ref(null);
const formModel = ref(cloneDeep(formInit));
const showModalPreview = ref(false);
const previewImageUrl = ref();
const fileList = ref([]);
const loading = ref(false);

const rules = {
  name: [{ required: true, message: 'Thông tin bắt buộc', trigger: ['change', 'blur'] }]
};

const title = computed(() => {
  return props.mode === 'detail' ? 'Chi tiết sân' : props.mode === 'create' ? 'Thêm mới sân' : 'Sửa thông tin sân';
});

const detailMode = computed(() => props.mode === 'detail');

const handleUpload = fileListData => {
  const file = fileListData[0].file;
  if (file) {
    // Kiểm tra xem kích thước tệp có vượt quá giới hạn không (ví dụ: 5MB)
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      // Hiển thị thông báo lỗi nếu kích thước vượt quá giới hạn
      message.error('Kích thước tệp quá lớn. Vui lòng chọn một tệp nhỏ hơn 5MB.');
      // Xoá tệp đang chọn (tùy chọn)
      fileList.value = [];
      return;
    }

    // Tiếp tục xử lý tải lên hình ảnh
    fileList.value = fileListData;
    const reader = new FileReader();
    reader.onload = () => {
      previewImageUrl.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleSave = () => {
  formRef.value
    ?.validate(async errors => {
      if (errors) return;
      loading.value = true;

      try {
        const formData = new FormData();
        let fieldData;
        if (props.mode === 'create') {
          fieldData = {
            ...formModel.value,
            ownedBy: userData.email
          };
        } // case edit
        else {
          fieldData = {
            ...formModel.value,
            ownedBy: props.detailData?.ownedBy
          };
        }

        formData.append('fieldData', JSON.stringify(fieldData));
        if (fileList.value?.[0]) formData.append('image', fileList.value[0].file);

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
  fileList.value = [];
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
        imageSrc: val?.imageSrc,
        price: val?.price?.toString(),
        playerNum: val?.playerNum?.toString(),
        description: {
          facilities: val?.description?.facilities,
          transportation: val?.description?.transportation
        }
      };
  },
  {
    immediate: true,
    deep: true
  }
);
</script>
