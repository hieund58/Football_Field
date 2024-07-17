<template>
  <n-drawer v-model:show="open" :width="502" placement="right" :on-update:show="onUpdateShow">
    <n-drawer-content title="Giỏ hàng" closable :native-scrollbar="false">
      <div v-for="product in products" :key="product.id" class="flex py-6">
        <div class="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          <img :src="product.imageSrc" :alt="product.imageAlt" class="h-full w-full object-cover object-center" />
        </div>

        <div class="ml-4 flex flex-1 flex-col">
          <div>
            <div class="flex justify-between text-base sm:text-lg font-medium text-gray-900">
              <h3>
                <a :href="product.href">{{ product.name }}</a>
              </h3>
              <p class="ml-4">{{ product.price }}</p>
            </div>
            <p class="mt-1 text-sm text-gray-500">
              {{ product.color }}
            </p>
          </div>
          <div class="flex flex-1 items-end justify-between text-sm">
            <p class="text-gray-500">Số Lượng {{ product.quantity }}</p>
            <div class="flex">
              <button type="button" class="font-medium text-indigo-600 hover:text-indigo-500">Xóa</button>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="text-base sm:text-lg font-medium text-gray-900">
          <p class="mr-2">Tổng: 300.000 Vnđ</p>
        </div>
        <n-space class="items-center" :wrap="false">
          <n-button type="info" color="#4f46e5">
            <template #icon>
              <n-icon>
                <CashIcon />
              </n-icon>
            </template>
            Thanh toán
          </n-button>
          <p>
            <button type="button" class="font-medium text-indigo-600 hover:text-indigo-500" @click="open = false">
              Tiếp Tục Mua
              <span aria-hidden="true">&rarr;</span>
            </button>
          </p>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue';
import { CardOutline as CashIcon } from '@vicons/ionicons5';

const emits = defineEmits(['close']);
const props = defineProps({
  open: Boolean
});

const open = ref(false);
const products = [
  {
    id: 1,
    name: 'Áo Đá Việt Nam',
    href: '#',
    color: 'Red',
    price: '300.000',
    quantity: 1,
    imageSrc:
      'https://th.bing.com/th/id/R.50c7934bd6541abbb51e48f4d9a3f87e?rik=t%2bUklWGK5pLWJA&riu=http%3a%2f%2fbelo.vn%2fwp-content%2fuploads%2f2018%2f11%2fz1188384674228_416a3f7ef7a51b72f6098f6a68536743.jpg'
  },
  {
    id: 2,
    name: 'Áo Đá Việt Nam',
    href: '#',
    color: 'White',
    price: '300.000',
    quantity: 4,
    imageSrc: 'https://belo.vn/wp-content/uploads/2018/11/z1188384711253_b6f0da3ac39aa5537f3536ff9e1d82b8.jpg'
  },
  {
    id: 3,
    name: 'Áo Đá Việt Nam',
    href: '#',
    color: 'White',
    price: '300.000',
    quantity: 4,
    imageSrc: 'https://belo.vn/wp-content/uploads/2018/11/z1188384711253_b6f0da3ac39aa5537f3536ff9e1d82b8.jpg'
  },
  {
    id: 4,
    name: 'Áo Đá Việt Nam',
    href: '#',
    color: 'White',
    price: '300.000',
    quantity: 4,
    imageSrc: 'https://belo.vn/wp-content/uploads/2018/11/z1188384711253_b6f0da3ac39aa5537f3536ff9e1d82b8.jpg'
  },
  {
    id: 5,
    name: 'Áo Đá Việt Nam',
    href: '#',
    color: 'White',
    price: '300.000',
    quantity: 4,
    imageSrc: 'https://belo.vn/wp-content/uploads/2018/11/z1188384711253_b6f0da3ac39aa5537f3536ff9e1d82b8.jpg'
  }
];

const onUpdateShow = show => {
  if (!show) {
    emits('close');
  }
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
