<template>
  <div class="wrapper">
    <div class="bg-white">
      <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900">Dụng cụ thể thao</h2>

        <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          <div
            v-for="product in currentPageProducts"
            :key="product._id"
            class="group relative hover:cursor-pointer"
            @click="openProductDialog(product)"
          >
            <div
              class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80"
            >
              <img
                :src="getImgUrl(product.imageSrc)"
                :alt="product.imageAlt"
                class="h-full w-full object-cover object-center lg:h-full lg:w-full"
              />
            </div>
            <div class="mt-4 flex justify-between">
              <p class="text-sm font-medium text-gray-700">
                {{ product.name }}
              </p>
              <p class="text-sm font-medium text-gray-900">
                {{ formatMoney(product.price) }}
              </p>
            </div>
            <div class="mt-2 flex justify-between">
              <p class="text-sm font-medium text-gray-700">Số lượng</p>
              <p class="text-sm font-medium text-gray-900">
                {{ formatMoney(product.remaining, ',', '') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TransitionRoot as="template" :show="dialogOpen">
      <Dialog as="div" class="relative z-10" @close="closeProductDialog">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block"></div>
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enter-to="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 md:scale-100"
              leave-to="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <DialogPanel
                class="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl"
              >
                <div
                  class="content relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8"
                >
                  <button
                    type="button"
                    class="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                    @click="closeProductDialog"
                  >
                    <span class="sr-only">Close</span>
                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                  </button>

                  <div class="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                    <div
                      class="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5"
                    >
                      <img
                        :src="getImgUrl(selectedProduct.imageSrc)"
                        :alt="selectedProduct.imageAlt"
                        class="object-cover object-center"
                      />
                    </div>
                    <div class="sm:col-span-8 lg:col-span-7">
                      <h2 class="text-2xl font-bold text-gray-900 sm:pr-12">
                        {{ selectedProduct.name }}
                      </h2>

                      <section aria-labelledby="information-heading" class="mt-2">
                        <h3 id="information-heading" class="sr-only">Product information</h3>

                        <p class="text-2xl text-gray-900">
                          {{ formatMoney(selectedProduct.price) }}
                        </p>

                        <!-- Reviews -->
                        <div class="mt-8">
                          <h4 class="text-sm font-medium text-gray-900">Mô tả</h4>
                          <p class="text-sm font-[400]">{{ selectedProduct.description }}</p>
                        </div>
                      </section>

                      <section aria-labelledby="options-heading" class="mt-10">
                        <h3 id="options-heading" class="sr-only">Product options</h3>

                        <!-- Colors -->
                        <div>
                          <h4 class="text-sm font-medium text-gray-900">Chọn Màu</h4>

                          <RadioGroup v-model="selectedColor" class="mt-4">
                            <RadioGroupLabel class="sr-only">Choose a color</RadioGroupLabel>
                            <span class="flex items-center space-x-3">
                              <RadioGroupOption
                                as="template"
                                v-for="color in selectedProduct.colors"
                                :key="color.name"
                                :value="color"
                                v-slot="{ active, checked }"
                              >
                                <div
                                  :class="[
                                    color.selectedClass,
                                    active && checked ? 'ring ring-offset-1' : '',
                                    !active && checked ? 'ring-2' : '',
                                    '-m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none'
                                  ]"
                                >
                                  <RadioGroupLabel as="span" class="sr-only">{{ color.name }}</RadioGroupLabel>
                                  <span
                                    aria-hidden="true"
                                    :class="[
                                      // color.class,
                                      'h-8 w-8 rounded-full border border-black border-opacity-10'
                                    ]"
                                    :style="{ background: color.name }"
                                  />
                                </div>
                              </RadioGroupOption>
                            </span>
                          </RadioGroup>
                        </div>

                        <!-- Sizes -->
                        <div class="mt-10">
                          <div class="flex items-center justify-between">
                            <h4 class="text-sm font-medium text-gray-900">Size</h4>
                            <a href="#" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">Size guide</a>
                          </div>

                          <RadioGroup v-model="selectedSize" class="mt-4">
                            <RadioGroupLabel class="sr-only">Choose a size</RadioGroupLabel>
                            <div class="grid grid-cols-4 gap-4">
                              <RadioGroupOption
                                as="template"
                                v-for="size in selectedProduct.sizes"
                                :key="size.name"
                                :value="size"
                                :disabled="!size.inStock"
                                v-slot="{ active, checked }"
                              >
                                <div
                                  :class="[
                                    size.inStock
                                      ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                                      : 'cursor-not-allowed bg-gray-50 text-gray-200',
                                    active ? 'ring-2 ring-indigo-500' : '',
                                    'group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1'
                                  ]"
                                >
                                  <RadioGroupLabel as="span">{{ size.name }}</RadioGroupLabel>
                                  <span
                                    v-if="size.inStock"
                                    :class="[
                                      active ? 'border' : 'border-2',
                                      checked ? 'border-indigo-500' : 'border-transparent',
                                      'pointer-events-none absolute -inset-px rounded-md'
                                    ]"
                                    aria-hidden="true"
                                  ></span>
                                  <span
                                    v-else
                                    aria-hidden="true"
                                    class="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                  >
                                    <svg
                                      class="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                      viewBox="0 0 100 100"
                                      preserveAspectRatio="none"
                                      stroke="currentColor"
                                    >
                                      <line x1="0" y1="100" x2="100" y2="0" vector-effect="non-scaling-stroke" />
                                    </svg>
                                  </span>
                                </div>
                              </RadioGroupOption>
                            </div>
                          </RadioGroup>
                        </div>

                        <button
                          @click="onAddToCart"
                          class="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Thêm Vào Giỏ Hàng
                        </button>
                      </section>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
    <div class="pagination flex justify-center items-center px-4 lg:px-8">
      <button @click="prevPage" :disabled="page === 1" class="icon-pagination">
        <font-awesome-icon :icon="['fas', 'arrow-left']" />
      </button>
      <span>Trang {{ page }}</span>
      <button @click="nextPage" :disabled="page >= totalPages" class="icon-pagination">
        <font-awesome-icon :icon="['fas', 'arrow-right']" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import {
  Dialog,
  DialogPanel,
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

import { getImgUrl, formatMoney } from '@/utils/common';

const props = defineProps({
  products: Array
});

const selectedProduct = ref(null);
const dialogOpen = ref(false);
const selectedColor = ref(null);
const selectedSize = ref(null);
const page = ref(1);
const pageSize = 4;
const filteredProducts = ref([]);
const products = ref([]);

const openProductDialog = product => {
  selectedProduct.value = product;
  dialogOpen.value = true;
};

const closeProductDialog = () => {
  dialogOpen.value = false;
};

const totalPages = computed(() => Math.ceil(products.value.length / pageSize));

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
  }
};

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++;
  }
};

const currentPageProducts = computed(() => {
  const startIdx = (page.value - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  return products.value.slice(startIdx, endIdx);
});

const onAddToCart = () => {
    if (!selectedColor.value || !selectedSize.value) {
        
    }
  console.log(selectedColor.value, selectedSize.value);
};

watch(
  () => props.products,
  val => {
    products.value = val;
  },
  {
    deep: true,
    immediate: true
  }
);
</script>
<style scoped>
.wrapper {
  margin: 10px;
}

.content {
  margin-top: 10px;
}

.pagination {
  padding-bottom: 10px;
}

.icon-pagination {
  padding: 0 10px;
}

.icon-pagination:hover {
  /* font-size: 17px; */
  color: rgb(250, 69, 22);
}
</style>
