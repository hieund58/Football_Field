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

const props = defineProps({
  mode: { type: String, default: 'create' },
  detailData: Object
});
const emits = defineEmits(['success', 'close']);

const message = useMessage();
const formInit = {
    email: '',
    role: '',
    phone: '',
    fullName: ''
};

const formRef = ref(null);
const formModel = ref(cloneDeep(formInit));
const loading = ref(false);

</script>