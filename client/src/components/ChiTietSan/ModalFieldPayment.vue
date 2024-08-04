<template>
  <n-modal v-model:show="show">
    <n-card
      style="width: 400px"
      :title="modalTitle"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
    <div v-if="!isCancel">
      <div class="w-full h-[60px] mb-2">
        <img
          src="https://irp.cdn-website.com/621d057d/dms3rep/multi/Paypal.png"
          alt=""
          style="width: 100%; height: 100%; object-fit: cover"
        />
      </div>

      <span class="block font-[600] mb-2">Bạn có chắc chắn đặt sân?</span>
      <div class="flex flex-col w-full">
        <div class="flex flex-row justify-between">
          <span class="font-[600]">Giá tiền</span>
          <span class="font-[700] text-[#f03131]">{{ formatMoney(data?.fieldPrice) }}</span>
        </div>
        <div class="flex flex-row justify-between">
          <span class="font-[600]">Giá tiền tương ứng USD</span>
          <span class="font-[700] text-[#f03131]">{{ vndToUsd(data?.fieldPrice) }}</span>
        </div>
        <div class="flex flex-row justify-between">
          <span class="font-[600]">Vào ngày</span>
          <span class="font-[700] text-[#f03131]">{{ formatDateVn(data?.scheduleDate) }}</span>
        </div>
        <div class="flex flex-row justify-between">
          <span class="font-[600]">Khung giờ</span>
          <span class="font-[700] text-[#f03131]">{{ data?.slotName }}</span>
        </div>
      </div>
    </div>
    <div v-else>
      <span class="block font-[600] mb-2">Sân đã được đặt bởi</span>
      <span class="block font-[600] mb-2">Bạn có chắc chắn hủy sân?</span>
    </div>
      <template #footer>
        <n-button v-if="!isCancel" :loading="loading" type="info" @click="handlePayment">
          <template #icon>
            <n-icon><LogoPaypal /></n-icon>
          </template>
          Thanh toán
        </n-button>
        <n-button v-else type="error" @click="cancelBooking">
          <template #icon>
            <n-icon><CloseCircleOutline /></n-icon>
          </template>
          Hủy sân</n-button>
        <n-button class="ml-2" @click="emits('close')">
          <template #icon>
            <n-icon><CloseOutline /></n-icon>
          </template>
          Đóng
        </n-button>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup>
import { computed, ref } from 'vue';
import axios from 'axios';
import { useMessage } from 'naive-ui';
import { LogoPaypal, CloseOutline, CloseCircleOutline } from '@vicons/ionicons5';

import { getUserData, vndToUsd, formatMoney, formatDateVn } from '@/utils/common';

const emits = defineEmits(['close', 'cancel-success']);

const props = defineProps({
  show: Boolean,
  data: Object
});

const message = useMessage();

const loading = ref(false);

const show = computed(() => props.show);
const isCancel = computed(() => props.data?.slotStatus === 'booked');
const modalTitle = computed(() => isCancel.value ? 'Xác nhận hủy sân' : 'Xác nhận thanh toán')

const createDefaultSchedule = async () => {
  const payload = {
    fieldId: props.data?.fieldId,
    date: props.data?.scheduleDate
  };
  try {
    await axios.post('http://localhost:5000/api/schedule', payload);
  } catch (error) {
    message.error(error?.response?.data?.message || 'Đặt lịch thất bại');
  }
};

const handlePayment = async () => {
  const userData = getUserData();
  console.log('🚀 ~ handlePayment ~ userData:', userData);
  const requestBody = {
    type: 'booking',
    fromUser: userData?.email,
    bookingData: {
      fieldId: props.data?.fieldId,
      scheduleDate: props.data?.scheduleDate,
      scheduleSlotHour: props.data?.slotHour
    },
    price: vndToUsd(props.data?.fieldPrice)
  };

  try {
    loading.value = true;
    await createDefaultSchedule();
    const res = await axios.post('http://localhost:5000/api/paypal/create', requestBody);
    loading.value = false;
    window.location.assign(res?.data?.approvalUrl);
  } catch (error) {
    loading.value = false;
    message.error(error?.response?.data?.message || 'Đặt lịch thất bại');
  }
};

const cancelBooking = async () => {
  const payload = {
    fieldId: props.data?.fieldId,
    date: props.data?.scheduleDate,
    slotHour: props.data?.slotHour,
    slotStatus: 'available'
  };
  try {
    loading.value = true;
    const res = await axios.put('http://localhost:5000/api/schedule', payload);
    message.success(res.data?.message);
    emits('cancel-success');
  } catch (error) {
    message.error(error?.response?.data?.message || 'Hủy lịch thất bại');
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
:deep(.n-card-header) {
  padding: 15px 0 15px 15px;
}
:deep(.n-card__content) {
  padding: 0 15px 15px 15px;
}
:deep(.n-card__footer) {
  text-align: center;
  padding-bottom: 17px;
}
</style>
