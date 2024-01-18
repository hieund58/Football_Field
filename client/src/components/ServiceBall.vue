<template>
  <div class="bg-white">
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <h2 class="text-2xl font-bold tracking-tight text-gray-900">Các Dịch Vụ</h2>
      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        <div v-for="product in products" :key="product.id" class="group relative">
          <router-link :to="product.href" class="text-center">
            <div
              class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
              <img :src="product.imageSrc" :alt="product.imageAlt"
                class="h-full w-full object-cover object-center lg:h-full lg:w-full" />
            </div>
            <div class="mt-4 flex justify-between">
              <div>
                <h3 class="text-sm text-gray-1000 text-lg font-semibold">
                  {{ product.name }}
                </h3>
                <p class="mt-1 text-sm text-gray-500">{{ product.title }}</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

  <script setup>
const products = [
  {
    id: 1,
    name: 'Sân Bóng',
    href: '/bookingball',
    imageSrc: 'https://bulbal.vn/wp-content/uploads/2023/01/TOP-10-SAN-BONG-DA-PHUI-TAI-TPHCM-NAM-2023.jpg',
    title: 'Cung cấp cho mọi người những sân bóng chất lượng. ',
  },
  {
    id: 2,
    name: 'Dụng Cụ Thể Thao',
    href: '#',
    imageSrc: 'https://www.thethaothientruong.vn/uploads/2020/phu-kien-bong-da.jpg',
    title: 'Các dụng cụ không thể thiếu khi tham gia.',
  },
  {
    id: 3,
    name: 'Áo Đá ',
    href: '/quanao',
    imageSrc: 'https://rozaco.vn/wp-content/uploads/2022/08/AoKhongLogo-Ro-BG000088.jpg',
    title: 'Khoác lên những "Chiến Bào" giúp mọi người tự tin chiến thắng.',
  },

]
  </script>
  <style scoped>

</style>