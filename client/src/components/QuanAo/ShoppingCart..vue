<template>
    <div class="wrapper">
        <TransitionRoot as="template" :show="open">
            <Dialog as="div" class="relative z-10" @close="open = false">
                <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0"
                    enter-to="opacity-100" leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                </TransitionChild>
    
                <div class="fixed inset-0 overflow-hidden">
                    <div class="absolute inset-0 overflow-hidden">
                        <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full sm:max-w-md pl-4 sm:pl-10">
                            <TransitionChild as="template"
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enter-from="translate-x-full" enter-to="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leave-from="translate-x-0" leave-to="translate-x-full">
                                <DialogPanel class="pointer-events-auto w-screen sm:max-w-md">
                                    <div class="content flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                        <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                            <div class="flex items-start justify-between">
                                                <DialogTitle class="text-lg sm:text-xl font-medium text-gray-900">Shopping
                                                    cart</DialogTitle>
                                                <div class="ml-3 flex h-7 items-center">
                                                    <button type="button"
                                                        class="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                                        @click="open = false">
                                                        <span class="absolute -inset-0.5" />
                                                        <span class="sr-only">Close panel</span>
                                                        <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="mt-8">
                                                <div class="flow-root">
                                                    <ul role="list" class="-my-6 divide-y divide-gray-200">
                                                        <li v-for="product in products" :key="product.id" class="flex py-6">
                                                            <div
                                                                class="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                                <img :src="product.imageSrc" :alt="product.imageAlt"
                                                                    class="h-full w-full object-cover object-center" />
                                                            </div>
    
                                                            <div class="ml-4 flex flex-1 flex-col">
                                                                <div>
                                                                    <div
                                                                        class="flex justify-between text-base sm:text-lg font-medium text-gray-900">
                                                                        <h3>
                                                                            <a :href="product.href">{{ product.name }}</a>
                                                                        </h3>
                                                                        <p class="ml-4">{{ product.price }}</p>
                                                                    </div>
                                                                    <p class="mt-1 text-sm text-gray-500">{{ product.color
                                                                        }}</p>
                                                                </div>
                                                                <div class="flex flex-1 items-end justify-between text-sm">
                                                                    <p class="text-gray-500">Số Lượng {{ product.quantity }}
                                                                    </p>
                                                                    <div class="flex">
                                                                        <button type="button"
                                                                            class="font-medium text-indigo-600 hover:text-indigo-500">Xóa</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
    
                                        <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
                                            <div
                                                class="flex justify-between text-base sm:text-lg font-medium text-gray-900">
                                                <p>Tổng</p>
                                                <p>300.000 Vnd</p>
                                            </div>
    
                                            <div class="mt-6">
                                                <a href="#"
                                                    class="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">Thanh
                                                    Toán</a>
                                            </div>
                                            <div class="mt-6 flex justify-center text-center text-sm text-gray-500">
                                                <p>
    
                                                    <button type="button"
                                                        class="font-medium text-indigo-600 hover:text-indigo-500"
                                                        @click="open = false">
                                                        Tiếp Tục Mua
                                                        <span aria-hidden="true"> &rarr;</span>
                                                    </button>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
    </div>
</template>
  
  
  <script setup>
import { ref, defineProps, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
const open = ref(false);
const props = defineProps({
  open: Boolean
});
const products = [
  {
    id: 1,
    name: 'Áo Đá Việt Nam',
    href: '#',
    color: 'Red',
    price: '300.000',
    quantity: 1,
    imageSrc: 'https://th.bing.com/th/id/R.50c7934bd6541abbb51e48f4d9a3f87e?rik=t%2bUklWGK5pLWJA&riu=http%3a%2f%2fbelo.vn%2fwp-content%2fuploads%2f2018%2f11%2fz1188384674228_416a3f7ef7a51b72f6098f6a68536743.jpg&ehk=c%2fSM4moCTUr04VPvYN%2bT6incwFEJHXADwZ6kJmDKyHA%3d&risl=&pid=ImgRaw&r=0',
  },
  {
    id: 2,
    name: 'Áo Đá Việt Nam',
    href: '#',
    color: 'White',
    price: '300.000',
    quantity: 4,
    imageSrc: 'https://belo.vn/wp-content/uploads/2018/11/z1188384711253_b6f0da3ac39aa5537f3536ff9e1d82b8.jpg',
  },
]
watch(() => props.open, (newValue) => {
  open.value = newValue;
});

  </script>
  <style scoped>
.content {
    margin-top: 130px;
    height: 86%;
}
</style>