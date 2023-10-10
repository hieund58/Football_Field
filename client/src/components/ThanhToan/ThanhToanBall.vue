<template>
    <div class="wrapper">
        <div class="header">
            <n-row>
                <n-col span="24">
                    <font-awesome-icon class="icon-credit" :icon="['fas', 'credit-card']" />
                </n-col>
            </n-row>
            <n-row>
                <n-col span="24">
                    <h1 id="the-h1">Thanh Toán</h1>
                    <span>Vui lòng kiểm tra kĩ thông tin sân trước khi đặt sân.</span>
                </n-col>
            </n-row>
        </div>
        <div class="content">
            <n-grid cols="2">
                <n-gi class="content-anh" span="1">
                    <img class="carousel-img" :src="infoImage.anh" />
                </n-gi>
                <n-gi class="content-thongtin" span="1">
                    <n-table :bordered="true" :single-line="false">
                        <thead>
                            <th class="thongtin-cangiua">Thông Tin</th>
                            <th></th>
                        </thead>
                        <tbody>
                            <tr v-for="(value, label) in sanInfo" :key="label">
                                <td class="thongtin-cangiua">{{ label }}</td>
                                <td>{{ value }}</td>
                            </tr>
                        </tbody>
                    </n-table>
                    <div class="payment-methods">
                        <h1>Hình Thức Thanh Toán</h1>
                        <div class="cash-banking">
                            <label>
                                <input type="checkbox" value="cash" v-model="cashSelected" class="input-checkbox"
                                    @change="handleCheckboxChange('cash')" /> Tiền Mặt
                            </label>
                            <label>
                                <input type="checkbox" value="banking" v-model="bankingSelected" class="input-checkbox"
                                    @change="handleCheckboxChange('banking')" /> Banking
                            </label>
                        </div>
    
    
                        <div v-if="bankingSelected" style="display:flex;justify-content:center">
                            <img src="../../assets/images/qrthanhtoan.png" alt="Banking" style="width:50%;height:50%;" />
                        </div>
                        <button @click="handlePayment">Thanh Toán</button>
                        <div v-if="!isPaymentValid && paymentClicked" style="color: red;">Vui lòng chọn phương thức thanh
                            toán !</div>
                        <div v-if="isPaymentValid && paymentClicked" style="color :rgb(0, 218, 0)">Đặt sân thành công !</div>
                    </div>
    
                </n-gi>
    
            </n-grid>
    
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { computed } from 'vue';
const isPaymentSelected = ref(false);
const paymentClicked = ref(false);
const isPaymentValid = computed(() => {
  return isPaymentSelected.value;
});
const cashSelected = ref(false);
const bankingSelected = ref(false);

function handlePayment() {
  paymentClicked.value = true;
  if (cashSelected.value || bankingSelected.value) {
    isPaymentSelected.value = true;
  } else {
    isPaymentSelected.value = false;
  }
}
watch(cashSelected, (newValue) => {
  if (newValue) {
    bankingSelected.value = false;
  }
});
watch(bankingSelected, (newValue) => {
  if (newValue) {
    cashSelected.value = false;
  }
});
const sanInfo = ref({
  "Tên": 'Sân Trường Đại Học Phenikaa',
  "Loại Sân": '6-7 người',
  "Địa Chỉ": 'Nguyễn Văn Trác, Yên Nghĩa, Hà Đông, Hà Nội',
  "Ngày": '05/10/2023',
  "Giờ": '5:30 - 7:00 ',
  "Giá Sân": '500.000/trận',

})
const infoImage = ref({
  anh: 'https://sanconhantao.vn/wp-content/uploads/2020/10/San-dai-hoc-Phenikaa-4.jpg',
})
</script>
<style scoped>
.wrapper {
    margin: auto;
    max-width: 1000px;
    width: 100%;
    padding-bottom: 300px;
}

.header {
    max-width: 500px;
    width: 100%;
    text-align: center;
    margin: auto;
    height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.icon-credit {
    font-size: 80px;
    padding: 6px;
}

#the-h1 {
    font-size: 30px;
    font-weight: 500;
}

.content-anh {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.content-anh img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.content-thongtin {
    padding: 0 0 0 2px;
}

.thongtin-cangiua {
    text-align: center;
}

.checkboxes {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.banking-image {
    display: none;
}

.banking-image img {
    max-width: 100%;
    max-height: 200px;
}

.payment-methods {
    width: 100%;
    height: 300px;

    text-align: center;

}

.payment-methods h1 {
    font-size: 20px;
    font-weight: 500;
    padding: 10px;
}

.cash-banking {
    height: 50px;
    line-height: 50px;
    font-size:18px;
}
.cash-banking label {
    padding: 10px;
}

.payment-methods button {
    border: 1px solid #000;
    border-radius: 3px;
    padding: 5px;
}

.payment-methods button:hover {
    border: 1px solid #FA4516;
    color: #FA4516;
    cursor: pointer;
}

.input-checkbox {
    margin: 0 5px ;
    cursor: pointer;
    
}


</style>