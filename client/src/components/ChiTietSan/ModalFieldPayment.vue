<template>
  <n-modal v-model:show="show">
    <n-card style="width: 600px" title="Modal" :bordered="false" size="huge" role="dialog" aria-modal="true">
      <template #header-extra>Oops!</template>
      Content
      {{ data }}
      <template #footer>
        <n-button v-if="!isCancel" @click="handlePayment">Thanh toán</n-button>
        <n-button v-else @click="cancelBooking">Hủy sân</n-button>
        <n-button @click="emits('close')">Đóng</n-button>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup>
import { computed, ref } from 'vue';
import axios from 'axios';
import { useMessage } from 'naive-ui';

const emits = defineEmits(['close', 'success']);

const props = defineProps({
  show: Boolean,
  data: Object
});

const message = useMessage();

const show = computed(() => props.show);
const isCancel = computed(() => props.data?.slotStatus === 'booked')

const handlePayment = async () => {
  const payload = {
    fieldId: props.data?.fieldId,
    date: props.data?.scheduleDate,
    slotHour: props.data?.slotHour,
    slotStatus: 'booked'
  };
  try {
    const res = await axios.post('http://localhost:5000/api/schedule', payload);
    console.log("🚀 ~ handlePayment ~ res:", res)
    message.success(res.data?.message)
    emits('success');
  } catch (error) {
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
    const res = await axios.post('http://localhost:5000/api/schedule', payload);
    console.log("🚀 ~ cancelBooking ~ res:", res)
    message.success(res.data?.message)
    emits('success');
  } catch (error) {
    message.error(error?.response?.data?.message || 'Đặt lịch thất bại');
  }
}
</script>
