<template>
    <div>
      <Clothes :products="clothes" />
      <Equipments :products="equipments" />
    </div>
  </template>
  
  <script setup>
  import axios from 'axios';
  import { ref, computed, onMounted } from 'vue';
  import { useLoadingBar } from 'naive-ui';
  import { useRoute, useRouter } from 'vue-router';
  
  import { productClothesSizes, productShoeSizes } from '@/utils/constant';
  
  import Clothes from './components/Clothes.vue';
  import Equipments from './components/Equipments.vue';
  
  const loadingBar = useLoadingBar();
  const route = useRoute();
  const router = useRouter();
  
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
        colors: product?.colors ? parseArray(product.colors)?.map(color => ({
          name: color,
          class: `bg-${color}`,
          selectedClass: 'ring-gray-400'
        })) : null,
        sizes: product?.sizes ? allShoeSizes.map(size => ({
          name: size,
          inStock: parseArray(product.sizes)?.includes(size)
        })) : null
      }))
  );
  
  const executePayment = async () => {
    if (!route.query.token || !route.query.PayerID) {
      router.replace({ query: {} });
      return;
    }
    const paymentId = route.query.token;
    try {
      const res = await axios.post('http://localhost:5000/api/paypal/execute', { paymentId });
      console.log('🚀 ~ excutePayment ~ res:', res);
      message.success('Mua sản phẩm thành công');
      router.replace({ query: {} });
    } catch (error) {
      console.log('🚀 ~ excutePayment ~ error:', error);
      router.replace({ query: {} });
    }
  };
  
  const fetchProducts = async () => {
    try {
      
      const res = await axios.get('http://localhost:5000/api/products');
  
      products.value = res?.data;
      console.log('🚀 ~ onMounted ~ products.value :', products.value);
  
    } catch (error) {
      console.log('🚀 ~ excutePayment ~ error:', error);
    }
  
  }
  
  onMounted(async () => {
    loadingBar.start()
    await executePayment()
    await fetchProducts()
    loadingBar.finish()
  });
  </script>
  