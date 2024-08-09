<template>
  <n-drawer v-model:show="open" :width="502" placement="right" :on-update:show="onUpdateShow">
    <n-drawer-content title="Giỏ hàng" closable :native-scrollbar="false">
      <div v-for="(product, index) in products" :key="product.id" class="flex py-6">
        <div class="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          <n-image :src="product.imageSrc" :alt="product.imageAlt" object-fit="cover" />
        </div>

        <div class="ml-4 flex flex-1 flex-col">
          <div>
            <div class="flex justify-between text-base sm:text-lg font-medium text-gray-900">
              <h3>
                <a :href="product.href">{{ product.name }}</a>
              </h3>
              <p class="ml-4">{{ formatMoney(product.price) }}</p>
            </div>
            <p class="mt-1 text-sm text-gray-500">Màu: {{ product.color }}</p>
            <p class="mt-1 text-sm text-gray-500">Cỡ: {{ product.size }}</p>
          </div>
          <div class="flex flex-1 items-end justify-between text-sm mt-1">
            <p class="text-gray-500">Số Lượng: {{ product.quantity }}</p>
            <div class="flex">
              <button
                type="button"
                class="font-medium text-indigo-600 hover:text-indigo-500"
                @click="onRemoveProduct(index)"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="text-base sm:text-lg font-medium text-gray-900">
          <p class="mr-2">Tổng: {{ formatMoney(sumMoney) }}</p>
        </div>
        <n-space class="items-center" :wrap="false">
          <n-button type="info" :disabled="!products.length" color="#4f46e5" @click="openModalPayment">
            <template #icon>
              <n-icon>
                <CashIcon />
              </n-icon>
            </template>
            Thanh toán
          </n-button>
          <p>
            <button
              type="button"
              class="font-medium text-indigo-600 hover:text-indigo-500"
              @click="onUpdateShow(false)"
            >
              Tiếp Tục Mua
              <span aria-hidden="true">&rarr;</span>
            </button>
          </p>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
  <modal-payment
      v-model:show="showModalPayment"
      :data="paymentData"
      @close="showModalPayment = false"
    />
</template>

<script setup>
import { ref, computed, watch, inject } from 'vue';
import { CardOutline as CashIcon } from '@vicons/ionicons5';

import { getImgUrl, formatMoney } from '@/utils/common';

import ModalPayment from './ShoppingCartModalPay.vue'

const emits = defineEmits(['close']);
const props = defineProps({
  open: Boolean
});

const cartItems = inject('cartItems');

const open = ref(false);
const showModalPayment = ref(false);
const paymentData = ref(null)

const products = computed(() =>
  cartItems.value.map(item => ({
    ...item,
    imageSrc: getImgUrl(item.imageSrc)
  }))
);

const sumMoney = computed(() =>
  products.value?.map(product => product.price * product.quantity)?.reduce((acc, cur) => acc + cur, 0)
);

const onUpdateShow = show => {
  if (!show) {
    emits('close');
  }
};

const onRemoveProduct = index => {
  cartItems.value.splice(index, 1);
};

const openModalPayment = async () => {
  paymentData.value = {
    products: products.value,
    sumMoney: sumMoney.value
  }
  showModalPayment.value = true
};

watch(
  () => props.open,
  newValue => {
    open.value = newValue;
  }
);
</script>

<style scoped lang="scss">
:deep(.n-drawer-footer) {
  justify-content: space-between !important;
  align-items: center;
}
</style>
