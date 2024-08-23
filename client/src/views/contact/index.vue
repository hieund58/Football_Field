<template>
  <div class="wrapper">
    <div class="isolate bg-white px-6 py-12 sm:py-16 lg:px-8">
      <div
        class="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          class="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style="
            clip-path: polygon(
              74.1% 44.1%,
              100% 61.6%,
              97.5% 26.9%,
              85.5% 0.1%,
              80.7% 2%,
              72.5% 32.5%,
              60.2% 62.4%,
              52.4% 68.1%,
              47.5% 58.3%,
              45.2% 34.5%,
              27.5% 76.7%,
              0.1% 64.9%,
              17.9% 100%,
              27.6% 76.8%,
              76.1% 97.7%,
              74.1% 44.1%
            );
          "
        />
      </div>
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl" style="font-size: 60px">Hỗ trợ</h2>
      </div>
      <form v-on:submit.prevent="onSubmit" class="mx-auto mt-10 max-w-xl sm:mt-16">
        <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label for="first-name" class="block text-sm font-semibold leading-6 text-gray-900">Tên</label>
            <div class="mt-2.5">
              <input
                v-model="form.firstName"
                type="text"
                required
                name="first-name"
                id="first-name"
                autocomplete="given-name"
                class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label for="last-name" class="block text-sm font-semibold leading-6 text-gray-900">Họ</label>
            <div class="mt-2.5">
              <input
                v-model="form.lastName"
                type="text"
                required
                name="last-name"
                id="last-name"
                autocomplete="family-name"
                class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div class="sm:col-span-2">
            <label for="adress" class="block text-sm font-semibold leading-6 text-gray-900">Địa chỉ</label>
            <div class="mt-2.5">
              <input
                v-model="form.address"
                type="text"
                name="adress"
                id="adress"
                autocomplete="organization"
                class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div class="sm:col-span-2">
            <label for="email" class="block text-sm font-semibold leading-6 text-gray-900">Email</label>
            <div class="mt-2.5">
              <input
                v-model="form.email"
                type="email"
                name="email"
                required
                id="email"
                autocomplete="email"
                class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div class="sm:col-span-2">
            <label for="phone-number" class="block text-sm font-semibold leading-6 text-gray-900">Số điện thoại</label>
            <div class="relative mt-2.5">
              <input
                v-model="form.phone"
                type="tel"
                name="phone-number"
                id="phone-number"
                autocomplete="tel"
                class="block w-full rounded-md border-0 px-3.5 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div class="sm:col-span-2">
            <label for="message" class="block text-sm font-semibold leading-6 text-gray-900">Tin nhắn</label>
            <div class="mt-2.5">
              <textarea
                v-model="form.message"
                required
                name="message"
                id="message"
                rows="4"
                class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div class="mt-10">
          <button
            type="submit"
            class="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Gửi tin nhắn
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMessage } from 'naive-ui';

const message = useMessage();

const init = {
  firstName: '',
  lastName: '',
  address: '',
  email: '',
  phone: '',
  message: ''
};
const form = ref({
  ...init
});

function onSubmit() {
  console.log(form.value);
  message.success(`Đã nhận thông tin ${JSON.stringify(form.value)}`);
  form.value = { ...init };
}
</script>
<style scoped>
.wrapper {
  margin-bottom: 10px;
}
</style>
