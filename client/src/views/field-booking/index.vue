<template>
    <div class="warraper">
      <div class="search-content bg-slate-100 rounded-lg px-4 sm:p-1 lg:p-2">
        <n-grid cols="1 l:4" responsive="screen" :x-gap="10" :y-gap="10">
          <n-gi :span="1">
            <n-select v-model:value="searchForm.area" :options="areaList" multiple clearable placeholder="Chọn khu vực" />
          </n-gi>
          <n-gi :span="1">
            <n-select
              v-model:value="searchForm.priceRange"
              :options="priceRange"
              clearable
              placeholder="Chọn khoảng giá"
            />
          </n-gi>
          <n-gi :span="1">
            <n-select
              v-model:value="searchForm.playerNumRange"
              :options="playerNumRange"
              clearable
              placeholder="Chọn loại sân"
            />
          </n-gi>
          <n-gi :span="1">
            <n-space>
              <n-button type="info" ghost @click="handleSearch">
                <template #icon>
                  <n-icon><SearchOutline /></n-icon>
                </template>
                Tìm kiếm sân
              </n-button>
              <n-button type="error" ghost @click="handleReset">
                <template #icon>
                  <n-icon><ReloadOutline /></n-icon>
                </template>
                Tìm lại
              </n-button>
            </n-space>
          </n-gi>
        </n-grid>
      </div>
  
      <!-- <div class="bg-white"> -->
        <div class="mx-auto max-w-[90%] py-2">
          <div class="mt-6 grid gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5">
            <div v-for="field in currentPageFields" :key="field.id" class="group relative">
              <div
                class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80"
              >
                <img
                  :src="getImgUrl(field.avatarSrc)"
                  :alt="field.imageAlt"
                  class="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-between">
                <div>
                  <h1 class="text-sm font-medium text-gray-1000">
                    <!-- Điều hướng đến chi tiết sân -->
                    <router-link :to="'/detailball/' + field._id" class="absolute inset-0"></router-link>
                    {{ field.name }}
                  </h1>
                </div>
              </div>
              <p class="text-sm text-black-900">Khu Vực : {{ field.area }}</p>
              <p class="text-sm text-black-900">Sân : {{ field.playerNum }}</p>
              <p class="text-sm text-black-900">Giá : {{ formatMoney(field.price) }}/Trận</p>
            </div>
          </div>
        </div>
      <!-- </div> -->
      <div v-if="currentPageFields.length" class="pagination flex justify-center items-center">
        <button @click="prevPage" :disabled="page === 1">
          <font-awesome-icon class="icon-pagination" :icon="['fas', 'arrow-left']" />
        </button>
        <span>Trang {{ page }}/{{ totalPages }}</span>
        <button @click="nextPage" :disabled="page >= totalPages">
          <font-awesome-icon class="icon-pagination" :icon="['fas', 'arrow-right']" />
        </button>
      </div>
      <n-empty v-else description="Không tìm thấy sân" />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { cloneDeep } from 'lodash';
  import { SearchOutline, ReloadOutline } from '@vicons/ionicons5';

  import { FieldApi } from '@/api';
  import { getImgUrl, formatMoney } from '@/utils/common';
  import { areaList, priceRange, playerNumRange } from '@/utils/constant';
  
  const initSearchForm = {
    area: undefined,
    priceRange: undefined,
    playerNumRange: undefined
  };
  const searchForm = ref(cloneDeep(initSearchForm));
  const page = ref(1);
  const pageSize = 12;
  const fields = ref([
    {
      name: '',
      address: '',
      people: '', // Add this field
      price: '', // Add this field
      area: '',
      description: {
        facilities: '',
        transportation: ''
      },
      schedules: {
        date: '',
        time: '',
        status: '',
        totalCourts: ''
      }
    }
  ]);
  const filteredFields = ref([]);
  const totalPages = computed(() => Math.ceil(fields.value.length / pageSize));
  
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
  
  const currentPageFields = computed(() => {
    const startIdx = (page.value - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    return filteredFields.value.slice(startIdx, endIdx);
  });
  
  const handleSearch = () => {
    const val = searchForm.value;
    filteredFields.value = fields.value
      .filter(field => {
        if (!val.area?.length) return true;
        return val.area.includes(field.area);
      })
      .filter(field => {
        if (!val.priceRange) return true;
        const [priceFrom, priceTo] = val.priceRange.split(',');
        if (priceFrom === '0') return field.price < Number(priceTo);
        if (priceTo === '0') return field.price > Number(priceFrom);
        return Number(priceFrom) <= field.price && field.price <= Number(priceTo);
      })
      .filter(field => {
        if (!val.playerNumRange) return true;
        const [numFrom, numTo] = val.playerNumRange.split(',');
        if (numFrom === '0') return field.playerNum < Number(numTo);
        if (numTo === '0') return field.playerNum > Number(numFrom);
        return Number(numFrom) <= field.playerNum && field.playerNum <= Number(numTo);
      });
  };
  
  const handleReset = () => {
    searchForm.value = cloneDeep(initSearchForm);
    filteredFields.value = cloneDeep(fields.value);
  };
  
  onMounted(async () => {
    try {
      const res = await FieldApi.getFields();
      fields.value = res;
      filteredFields.value = cloneDeep(res);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  });
  </script>
  
  <style scoped>
  .warraper {
    height: 100%;
    width: 100%;
    margin: 0 auto;
  }
  
  .text-sm {
    padding: 0 0 15px 15px;
  }
  
  .bg-white {
  }
  
  .group {
    border-radius: 0.5rem;
    box-shadow: 0 1px 8px 3px #ccc;
  }
  
  .pagination {
    padding-top: 20px;
    padding-bottom: 20px;
  }
  
  .search-content {
    width: 90%;
    height: auto;
    margin: 20px auto 0 auto;
  }
  
  * {
    justify-content: center;
  }
  .icon-pagination {
    padding: 0 10px;
  }
  
  .icon-pagination:hover {
    font-size: 17px;
    color: rgb(250, 69, 22);
    cursor: pointer;
  }
  .n-button {
    padding: 15px;
  }
  
  .filter {
    padding: 10px;
  }
  
  .content-btn {
    border-bottom: 1px solid #000;
    margin-bottom: 6px;
    font-size: 18px;
    font-weight: 650;
  }
  </style>
  