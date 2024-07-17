<template>
  <div class="warraper">
    <div
      class="search-content shadow-xl bg-white rounded-lg p-4 sm:p-6 lg:p-12"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="filter">
          <h1 class="content-btn">Khu Vực</h1>
          <n-checkbox
            v-for="area in areas"
            :key="area"
            :checked="isChecked(area, 'area')"
            @update:checked="updateChecked(area, 'area')"
            :value="area"
            :label="area"
          />
        </div>
        <div class="filter">
          <h1 class="content-btn">Giá</h1>
          <n-checkbox
            v-for="price in prices"
            :key="price"
            :checked="isChecked(price, 'price')"
            @update:checked="updateChecked(price, 'price')"
            :value="price"
            :label="price"
          />
        </div>
        <div class="filter">
          <h1 class="content-btn">Loại Sân</h1>
          <n-checkbox
            v-for="person in people"
            :key="person"
            :checked="isChecked(person, 'person')"
            @update:checked="updateChecked(person, 'person')"
            :value="person"
            :label="person"
          />
        </div>
      </div>
    </div>

    <div class="bg-white">
      <div
        class="mx-auto max-w-full px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8"
      >
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 text-center">
          Sân Bóng Đá
        </h2>
        <div class="mt-6 grid gap-4 sm:gap-5 lg:grid-cols-2 xl:grid-cols-4">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="group relative"
          >
            <div
              class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80"
            >
              <img
                :src="product.imageSrc"
                :alt="product.imageAlt"
                class="h-full w-full object-cover object-center lg:h-full lg:w-full"
              />
            </div>
            <div class="mt-4 flex justify-between">
              <div>
                <h1 class="text-sm font-medium text-gray-1000">
                  <!-- Điều hướng đến chi tiết sản phẩm -->

                  <router-link
                    :to="'/detailball/' + product._id"
                    class="absolute inset-0"
                  ></router-link>
                  {{ product.name }}
                </h1>
              </div>
            </div>
            <p class="text-sm text-black-900">Khu Vực : {{ product.area }}</p>
            <p class="text-sm text-black-900">Sân : {{ product.people }}</p>
            <p class="text-sm text-black-900">Giá : {{ product.price }}/Trận</p>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination flex justify-center items-center p-4 lg:p-8">
      <button @click="prevPage" :disabled="page === 1">
        <font-awesome-icon
          class="icon-pagination"
          :icon="['fas', 'arrow-left']"
        />
      </button>
      <span>Trang {{ page }}</span>
      <button @click="nextPage" :disabled="page >= totalPages">
        <font-awesome-icon
          class="icon-pagination"
          :icon="['fas', 'arrow-right']"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getProducts } from "../../productService";
const page = ref(1);
const pageSize = 12;
const products = ref([
  {
    name: "",
    address: "",
    people: "", // Add this field
    price: "", // Add this field
    area: "",
    description: {
      facilities: "",
      prices: "",
      transportation: "",
    },
    schedules: {
      date: "",
      time: "",
      status: "",
      totalCourts: "",
    },
  },
]);
const totalPages = computed(() => Math.ceil(products.length / pageSize));

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
  return filteredProducts.slice(startIdx, endIdx);
});
onMounted(() => {
  filteredProducts.value = products;
});
const areas = computed(() => {
  // Lấy danh sách khu vực từ products
  const uniqueAreas = Array.from(
    new Set(products.value.map((product) => product.area)),
  );
  return uniqueAreas;
});

const prices = computed(() => {
  // Lấy danh sách giá từ products
  const uniquePrices = Array.from(
    new Set(products.value.map((product) => product.price)),
  );
  return uniquePrices;
});

const people = computed(() => {
  // Lấy danh sách loại sân từ products
  const uniquePeople = Array.from(
    new Set(products.value.map((product) => product.people)),
  );
  return uniquePeople;
});

const checkedArea = ref([]);
const checkedPrice = ref([]);
const checkedPerson = ref([]);

const isChecked = (value, column) => {
  if (column === "area") {
    return checkedArea.value.includes(value);
  } else if (column === "price") {
    return checkedPrice.value.includes(value);
  } else if (column === "person") {
    return checkedPerson.value.includes(value);
  }
};

const updateChecked = (value, column) => {
  if (column === "area") {
    if (checkedArea.value.includes(value)) {
      checkedArea.value = checkedArea.value.filter((item) => item !== value);
    } else {
      checkedArea.value.push(value);
    }
  } else if (column === "price") {
    if (checkedPrice.value.includes(value)) {
      checkedPrice.value = checkedPrice.value.filter((item) => item !== value);
    } else {
      checkedPrice.value.push(value);
    }
  } else if (column === "person") {
    if (checkedPerson.value.includes(value)) {
      checkedPerson.value = checkedPerson.value.filter(
        (item) => item !== value,
      );
    } else {
      checkedPerson.value.push(value);
    }
  }
};
const searchQuery = ref("");

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const areaMatch =
      checkedArea.value.length === 0 ||
      checkedArea.value.includes(product.area);
    const priceMatch =
      checkedPrice.value.length === 0 ||
      checkedPrice.value.includes(product.price);
    const personMatch =
      checkedPerson.value.length === 0 ||
      checkedPerson.value.includes(product.people);
    const searchMatch =
      !searchQuery.value ||
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    return areaMatch && priceMatch && personMatch && searchMatch;
  });
});

onMounted(async () => {
  try {
    products.value = await getProducts();
    console.log(products.value);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
});
</script>

<style scoped>
.warraper {
  height: auto;
  max-width: 1500px;
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
  padding-bottom: 100px;
}

.search-content {
  max-width: 1200px;
  width: 100%;
  height: auto;
  margin: 15px auto;
  padding: 50px;
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
}
.n-button {
  padding: 15px;
}

.filter {
  padding: 10px;
}

.content-btn {
  border-bottom: 1px solid #000;
  font-size: 18px;
  font-weight: 650;
}
</style>
