<template>
  <div>
    <Clothes :products="clothes" />
    <Equipments :products="equipments" />
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import Clothes from './Clothes.vue';
import Equipments from './Equipments.vue';

import { productClothesSizes, productShoeSizes } from '@/utils/constant';

const products = ref([]);

const parseArray = JSONstring => {
  if (!JSONstring) return [];
  return JSON.parse(JSONstring.replaceAll('\\', ''));
};

const allClothesSizes = productClothesSizes.map(e => e.value);
const allShoeSizes = productShoeSizes.map(e => e.value);

const clothes = computed(() =>
  products.value
    ?.filter(product => product.type === 'clothes')
    .map(product => ({
      ...product,
      colors: parseArray(product?.colors)?.map(color => ({
        name: color,
        class: `bg-${color}`,
        selectedClass: 'ring-gray-400'
      })),
      sizes: allClothesSizes.map(size => ({
        name: size,
        inStock: parseArray(product?.sizes)?.includes(size)
      }))
    }))
);

const equipments = computed(() =>
  products.value
    ?.filter(product => product.type !== 'clothes')
    .map(product => ({
      ...product,
      colors: parseArray(product?.colors)?.map(color => ({
        name: color,
        class: `bg-${color}`,
        selectedClass: 'ring-gray-400'
      })),
      sizes: allShoeSizes.map(size => ({
        name: size,
        inStock: parseArray(product?.sizes)?.includes(size)
      }))
    }))
);

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/products');

    products.value = res?.data;
    console.log('🚀 ~ onMounted ~ products.value :', products.value);
    filteredProducts.value = products.value;
  } catch (error) {}
});
</script>
