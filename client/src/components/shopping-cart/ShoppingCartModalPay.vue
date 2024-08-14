<template>
  <n-modal v-model:show="show">
    <n-card
      style="width: 600px"
      title="Xác nhận thanh toán"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <div class="w-full h-[60px] mb-2">
        <img
          src="https://irp.cdn-website.com/621d057d/dms3rep/multi/Paypal.png"
          alt=""
          style="width: 100%; height: 100%; object-fit: cover"
        />
      </div>

      <div class="flex flex-col w-full border-t border-b border-gray-200 py-4">
        <div class="flex flex-row justify-between">
          <span class="font-[600]">Giá tiền</span>
          <span class="font-[700] text-[#f03131]">{{ formatMoney(data?.sumMoney) }}</span>
        </div>
        <div class="flex flex-row justify-between mt-2">
          <span class="font-[600]">Giá tiền tương ứng USD</span>
          <span class="font-[700] text-[#f03131]">${{ vndToUsd(data?.sumMoney) }} USD</span>
        </div>
      </div>

      <template #footer>
        <n-button :loading="loading" type="info" @click="handlePayment">
          <template #icon>
            <n-icon><LogoPaypal /></n-icon>
          </template>
          Thanh toán
        </n-button>
        <n-button class="!ml-2" @click="emits('close')">
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
import { LogoPaypal, CloseOutline } from '@vicons/ionicons5';

import { getUserData, vndToUsd, formatMoney, formatDateVn } from '@/utils/common';

const emits = defineEmits(['close', 'cancel-success']);

const props = defineProps({
  show: Boolean,
  data: Object
});

const message = useMessage();

const loading = ref(false);

const show = computed(() => props.show);

const handlePayment = async () => {
  const requestBody = {
    type: 'purchase',
    fromUser: getUserData()?.email,
    purchaseData: props.data?.products?.map(product => ({
      productId: product._id,
      price: product.price,
      quantity: product.quantity
    })),
    price: vndToUsd(props.data?.sumMoney)
  };

  try {
    loading.value = true;
    const res = await axios.post('http://localhost:5000/api/paypal/create', requestBody);
    loading.value = false;
    window.location.assign(res?.data?.approvalUrl);
  } catch (error) {
    loading.value = false;
    message.error(error?.response?.data?.message || 'Thanh toán thất bại');
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
