<template>
    <div class="wrapper">
        <h1>Thông Tin Sân Bạn Đã Đặt</h1>
        <n-data-table :bordered="true" :single-line="true" :key="(row) => row.key" :columns="columns" :data="data" :pagination="paginationRef"
            :on-update:page="handlePageChange" />
    </div>
</template>
  
<script setup>
import { ref, computed, h } from 'vue'

const products = [
  {
    stt: 1,
    name: 'Sân bóng Trường Đại Học Phenikaa',
    address: 'Nguyễn Văn Trác, phường Yên Nghĩa, quận Hà Đông, thành phố Hà Nội',
    time: '7:00 - 8:30 (10/12/2023)',
    price: '300.000'
  },
  {
    stt: 2,
    name: 'Sân bóng Trường Đại Học Phenikaa',
    address: 'Nguyễn Văn Trác, phường Yên Nghĩa, quận Hà Đông, thành phố Hà Nội',
    time: '7:00 - 8:30 (10/12/2023)',
    price: '300.000'
  },
  {
    stt: 3,
    name: 'Sân bóng Trường Đại Học Phenikaa',
    address: 'Nguyễn Văn Trác, phường Yên Nghĩa, quận Hà Đông, thành phố Hà Nội',
    time: '7:00 - 8:30 (10/12/2023)',
    price: '300.000'
  },
  {
    stt: 4,
    name: 'Sân bóng Trường Đại Học Phenikaa',
    address: 'Nguyễn Văn Trác, phường Yên Nghĩa, quận Hà Đông, thành phố Hà Nội',
    time: '7:00 - 8:30 (10/12/2023)',
    price: '300.000'
  },
  {
    stt: 5,
    name: 'Sân bóng Trường Đại Học Phenikaa',
    address: 'Nguyễn Văn Trác, phường Yên Nghĩa, quận Hà Đông, thành phố Hà Nội',
    time: '7:00 - 8:30 (10/12/2023)',
    price: '300.000'
  },
  {
    stt: 6,
    name: 'Sân bóng Trường Đại Học Phenikaa',
    address: 'Nguyễn Văn Trác, phường Yên Nghĩa, quận Hà Đông, thành phố Hà Nội',
    time: '7:00 - 8:30 (10/12/2023)',
    price: '300.000'
  },
  {
    stt: 7,
    name: 'Sân bóng Trường Đại Học Phenikaa',
    address: 'Nguyễn Văn Trác, phường Yên Nghĩa, quận Hà Đông, thành phố Hà Nội',
    time: '7:00 - 8:30 (10/12/2023)',
    price: '300.000'
  },
  {
    stt: 8 ,
    name: 'Sân bóng Trường Đại Học Phenikaa',
    address: 'Nguyễn Văn Trác, phường Yên Nghĩa, quận Hà Đông, thành phố Hà Nội',
    time: '7:00 - 8:30 (10/12/2023)',
    price: '300.000'
  },
  {
    stt: 9,
    name: 'Sân bóng Trường Đại Học Phenikaa',
    address: 'Nguyễn Văn Trác, phường Yên Nghĩa, quận Hà Đông, thành phố Hà Nội',
    time: '7:00 - 8:30 (10/12/2023)',
    price: '300.000'
  },
  {
    stt: 10,
    name: 'Sân bóng Trường Đại Học Phenikaa',
    address: 'Nguyễn Văn Trác, phường Yên Nghĩa, quận Hà Đông, thành phố Hà Nội',
    time: '7:00 - 8:30 (10/12/2023)',
    price: '300.000'
  },
  {
    stt: 11,
    name: 'Sân bóng Trường Đại Học Phenikaa',
    address: 'Nguyễn Văn Trác, phường Yên Nghĩa, quận Hà Đông, thành phố Hà Nội',
    time: '7:00 - 8:30 (10/12/2023)',
    price: '300.000'
  },
  
]

const data = ref(products);

const getDataIndex = (key) => {
  return data.value.findIndex((item) => item.stt === key);
}

const page = ref(1);

const handlePageChange = (curPage) => {
  page.value = curPage;
};

const paginationRef = computed(() => ({
  pageSize: 10,
  page: page.value
}));


const columns = [
  {
    title: 'STT',
    key: 'stt',
    width: 70,
    align: 'center',
    render(_,index) {
      return index + 1;
    }
  },
  {
    title: 'Tên Sân',
    key: 'name',
    width: 250,
    align: 'center',
  },
  {
    title: 'Địa Chỉ',
    key: 'address',
    align: 'center',
  },
  {
    title: 'Thời Gian',
    key: 'time',
    align: 'center',
  },
  {
    title: 'Giá Sân',
    key: 'price',
    align: 'center',
   
  }
];
</script>

<style scoped>
.wrapper {
    height: auto;
    padding: 15px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
}
.wrapper h1 {
    padding: 20px 10px;
    font-size: 25px;
    font-weight: 500;
}
</style>