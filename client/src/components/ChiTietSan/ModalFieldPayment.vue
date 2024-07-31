<template>
    <n-modal v-model:show="show">
      <n-card
        style="width: 600px"
        title="Modal"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          Oops!
        </template>
        Content
        {{ data }}
        <template #footer>
            <n-button @click="handlePayment"> Thanh toán </n-button>
          <n-button @click="emits('close')"> Đóng </n-button>
        </template>
      </n-card>
    </n-modal>
  </template>
  
  <script setup>
  import { computed, ref } from 'vue'
  
 const props = defineProps({
    show: Boolean,
    data: Object
 })
 const show = computed(() => props.show)
 const emits = defineEmits(['close', 'success'])

 const handlePayment = () => {
    emits('success')
 }
  </script>