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
            <img class="carousel-img" :src="currentDetail && currentDetail.imageSrc" />
          </n-gi>
          <n-gi class="content-thongtin" span="1">
            <n-table :bordered="true" :single-line="false">
              <thead>
                <th class="thongtin-cangiua">Thông Tin</th>
                <th></th>
              </thead>
              <tbody>
                <tr>
                  <td class="thongtin-cangiua">Tên</td>
                  <td>{{ currentDetail && currentDetail.name }}</td>
                </tr>
                <tr>
                  <td class="thongtin-cangiua">Loại Sân</td>
                  <td>{{ currentDetail && currentDetail.people }}</td>
                </tr>
                <tr>
                  <td class="thongtin-cangiua">Địa Chỉ</td>
                  <td>{{ currentDetail && currentDetail.address }}</td>
                </tr>
                <tr>
                  <td class="thongtin-cangiua">Ngày</td>
                  <td>{{ selectDate }}</td>
                </tr>
                <tr>
                  <td class="thongtin-cangiua">Thời gian</td>
                  <td>{{ selectTime }}</td>
                </tr>
                <tr>
                  <td class="thongtin-cangiua">Giá tiền</td>
                  <td>{{ $route.query.price }}</td>
                </tr>
                <!-- Thêm các thuộc tính khác của detail theo cùng mẫu -->
              </tbody>
            </n-table>
            <div class="payment-methods">
              <h1>Hình Thức Thanh Toán</h1>
              <div class="cash-banking">
                <label>
                  <input type="checkbox" value="banking" v-model="bankingSelected" class="input-checkbox"
                    @change="handleCheckboxChange('banking')" />
                  Banking
                </label>
              </div>
              <iframe id="invoiceFrame" style="display: none;"></iframe>
  
              <div v-if="bankingSelected" style="display: flex; justify-content: center">
                <img src="../../assets/images/qrthanhtoan.png" alt="Banking" style="width: 50%; height: 50%;" />
              </div>
              <button @click="showPaymentDialog">Thanh toán</button>
              <div class="dialog-overlay" v-if="isPaymentDialogVisible">
                <div class="dialog-content">
                  <!-- Hiển thị hóa đơn và nút xác nhận -->
                  <div class="invoice-content">
                    <!-- Nội dung hóa đơn được hiển thị ở đây -->
                    <button @click="confirmPayment">Xác nhận thanh toán</button>
                    <button @click="closePaymentDialog">Hủy</button>
                  </div>
                </div>
              </div>
              <button @click="createOrderAndRedirectToVnPay">In hóa đơn</button>
              <div v-if="!isPaymentValid && paymentClicked" style="color: red;">Vui lòng chọn phương thức thanh toán !</div>
              <div v-if="isPaymentValid && paymentClicked" style="color: rgb(0, 218, 0)">Đặt sân thành công !</div>
            </div>
          </n-gi>
        </n-grid>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed, watch } from 'vue';
  import axios from 'axios';
  import { useRoute } from 'vue-router';
  import crypto from 'crypto';
  import sha256 from 'js-sha256';
  export default {
    props: {
      id: String, // Định nghĩa prop id kiểu String
      selectDate: String, // Định nghĩa props selectDate kiểu String
      selectTime: String,
      sanId: String, // Định nghĩa props selectTime kiểu String
    },
    data() {
      return {
        isPaymentDialogVisible: false,
        bankingSelected: false,
        isPaymentValid: false,
        paymentClicked: false,
      };
    },
    methods: {
      showPaymentDialog() {
        // Log to console to verify if the method is being called
        console.log('showPaymentDialog method called');
        this.isPaymentDialogVisible = true;
      },
      closePaymentDialog() {
        // Log to console to verify if the method is being called
        console.log('closePaymentDialog method called');
        this.isPaymentDialogVisible = false;
      },
      handleCheckboxChange(method) {
        if (method === 'banking') {
          this.bankingSelected = !this.bankingSelected;
        }
      },
      confirmPayment() {
        // Implement your payment confirmation logic here
        this.createOrderAndConfirmPayment();
      },
      async createOrderAndConfirmPayment() {
        try {
          const userData = JSON.parse(sessionStorage.getItem('userData'));
          const data = ref([{
            name: '',
            people: '',
            address: '',
            username: '', // Thay bằng thông tin tài khoản của người dùng
            sanId: '', // Sử dụng this.sanId từ props
            selectDate: '',
            selectTime: '',
            price: '', // Lấy giá từ query parameters
            paymentMethod: '',
            status:'',
          }]);
          const orderData = ref({
            name: this.currentDetail.name,
            people: this.currentDetail.people,
            address: this.currentDetail.address,
            username: userData.email, // Thay bằng thông tin tài khoản của người dùng
            sanId: this.sanId, // Sử dụng this.sanId từ props
            selectDate: this.selectDate,
            selectTime: this.selectTime,
            price: this.$route.query.price, // Lấy giá từ query parameters
            paymentMethod: this.bankingSelected ? 'banking' : 'cash',
            status:'',
          });
          // Thực hiện các bước thanh toán và xác nhận ở đây
          const response = await axios.post('http://localhost:5000/api/process-payment', orderData.value);
          if (response.data.message === 'Thanh toán thành công') {
            // Xử lý thành công
            data.value.push(orderData.value);
            console.log(orderData);
            // Để đóng dialog và hiển thị thông báo thành công:
            this.closePaymentDialog();
            this.isPaymentValid = true;
            this.paymentClicked = true;
          } else {
            // Xử lý trường hợp khác (nếu cần)
          }
        } catch (error) {
          console.error('Lỗi khi xử lý thanh toán:', error);
          // Xử lý lỗi (hiển thị thông báo lỗi cho người dùng)
        }
      },
      createOrderAndRedirectToVnPay() {
        // Implement your order creation and redirection logic here
      },
      async createOrderAndRedirectToVnPay() {
        // ... Các bước cập nhật thông tin hóa đơn giống như ở trên ...

        // Lấy email từ sessionStorage (đã có sẵn trong session)
        const userEmail = sessionStorage.getItem('userEmail');

        // Lấy số điện thoại từ props hoặc từ sessionStorage (tùy theo nhu cầu)
        const userPhone = '0987654321'; // Ví dụ

        // Lấy ngày tháng năm hôm nay
        const today = new Date();
        const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

        // Tạo nội dung HTML và CSS cho hóa đơn
        const invoiceHtml = `
    <html>
    <head>
      <title>Hóa Đơn Thanh Toán</title>
      <style scoped>
  /* ... Các quy tắc CSS khác ... */

  /* Định dạng cho bảng */
  .invoice-table {
    width: 100%;
    border-collapse: collapse;
  }
  #invoiceFrame h1 {
  background-color: #007bff;
  color: white;
  padding: 10px;
  text-align: center; /* Để căn giữa theo chiều ngang */
}
  .invoice-table th,
  .invoice-table td {
    border: 1px solid #ddd; /* Đặt đường viền với màu và kích thước tùy chỉnh */
    padding: 10px;
    text-align: left;
  }
</style>


    </head>
    <body>
      <h1>Hóa Đơn Thanh Toán</h1>
      <div class="invoice-details">
        <p><strong>Email:</strong> ${userEmail}</p>
  <p><strong>Số Điện Thoại:</strong> ${userPhone}</p>
  <p><strong>Ngày Thanh Toán:</strong> ${formattedDate}</p>
  <table class="invoice-table">
    <tr>
      <th>Thông Tin</th>
      <th>Giá Trị</th>
    </tr>
    <tr>
      <td><strong>Tên:</strong></td>
      <td>${this.currentDetail.name}</td>
    </tr>
    <tr>
      <td><strong>Loại Sân:</strong></td>
      <td>${this.currentDetail.area}</td>
    </tr>
    <tr>
      <td><strong>Địa Chỉ:</strong></td>
      <td>${this.currentDetail.address}</td>
    </tr>
    <tr>
      <td><strong>Ngày:</strong></td>
      <td>${this.selectDate}</td>
    </tr>
    <tr>
      <td><strong>Thời gian:</strong></td>
      <td>${this.selectTime}</td>
    </tr>
    <tr>
      <td><strong>Giá tiền:</strong></td>
      <td>${this.$route.query.price}</td>
    </tr>
  </table>

  <!-- Thêm các thông tin khác của hóa đơn -->
</div>

    </body>
    </html>
  `;

        // Truy cập iframe bằng id
        const iframe = document.getElementById('invoiceFrame');

        // Thiết lập nội dung HTML cho iframe
        iframe.contentDocument.write(invoiceHtml);

        // Hiển thị iframe
        iframe.style.display = 'block';

        // Kích hoạt chức năng in trong iframe
        iframe.contentWindow.print();
      }
    
    },
    
    created() {
      // Lấy giá trị `price` từ query parameters
      const price = this.$route.query.price;
      console.log('Giá tiền:', price);
    },
    setup(props) {
      const route = useRoute();
      const selectDate = route.params.selectDate;
      const selectTime = route.params.selectTime;
      const currentDetail = ref({
        name: '',
        area: '',
        address: '',
        people: '',
        description: {
          facilities: '',
          prices: '',
          transportation: '',
        },
      });
      
      // Sử dụng watch để theo dõi thay đổi trong props.id
      watch(
        () => props.id,
        (newId) => {
          // Gọi hàm fetchDetail với newId để lấy dữ liệu dựa trên _id mới
          fetchDetail(newId);
        }
      );
  
      // Định nghĩa hàm fetchDetail để gọi API và lấy dữ liệu dựa trên _id
      const fetchDetail = async (newId) => {
        try {
          const response = await axios.get(`http://localhost:5000/api/products/${newId}`);
          currentDetail.value = response.data;
  
          if (currentDetail.value && currentDetail.value._id) {
            console.log('Detail cho _id hiện tại:', currentDetail.value);
          } else {
            console.error('Chi tiết sản phẩm không hợp lệ.');
          }
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu chi tiết sân:', error);
        }
      };
  
      // Hãy gọi fetchDetail ban đầu với giá trị của props.id
      onMounted(() => {
        if (props.id) {
          fetchDetail(props.id);
        }
      });
  
      return {
        currentDetail,
        // Các biến khác
      };
      // Rest của mã trong setup function
    },
  };
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
    font-size: 18px;
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
    margin: 0 5px;
    cursor: pointer;
  }
  </style>
  