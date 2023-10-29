<template>
  <div class="wrapper">
    <div v-if="selectedTab === 'sua-san'" class="sua-san">
      <!-- Nội dung sửa sân -->
      <h1>Chỉnh Sửa Sân</h1>
      <div class="sua-header">
        <span>Tên</span>
        <input v-model="data.name" type="text" placeholder="Tên Sân" />
        <span>Địa Chỉ</span>
        <input v-model="data.address" type="text" placeholder="Địa Chỉ Sân" />
        <span>Khu vực</span>
        <input v-model="data.area" type="text" placeholder="Khu vực" />
        <span>Giá</span>
        <input v-model="data.price" type="text" placeholder="Giá" />
        <span>Số người</span>
        <input v-model="data.people" type="text" placeholder="Số người" />
        <span>Ảnh</span>
        <input
          ref="imageInput"
          type="file"
          @change="handleImageUpload"
          accept="image/*"
        />
        <img
          v-if="data.imageSrc"
          :src="data.imageSrc"
          alt="Ảnh sân bóng"
          style="max-width: 100px; max-height: 100px"
        />

        <!-- Thêm các trường khác tương tự -->
      </div>
      <div class="sua-footer">
        <form @submit.prevent="updateSan">
          <div class="col-span-full">
            <label
              for="facilities"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Cơ Sở Vật Chất Và Tiện Ích Tại Sân</label
            >
            <div class="mt-2">
              <textarea
                id="facilities"
                name="facilities"
                rows="3"
                v-model="data.description.facilities"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              ></textarea>
            </div>
          </div>
          <div class="col-span-full">
            <label
              for="prices"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Giá Thuê</label
            >
            <div class="mt-2">
              <textarea
                id="prices"
                name="prices"
                rows="3"
                v-model="data.description.prices"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              ></textarea>
            </div>
          </div>
          <div class="col-span-full">
            <label
              for="transportation"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Cách Thức Di Chuyển</label
            >
            <div class="mt-2">
              <textarea
                id="transportation"
                name="transportation"
                rows="3"
                v-model="data.description.transportation"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              ></textarea>
            </div>
          </div>
        </form>
      </div>
      <div class="mt-6 flex items-center justify-end gap-x-6">
        <button
          @click="cancelEdit"
          type="button"
          class="btn-cancel text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="updateSan"
          class="btn-quanlysan rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm sm:leading-6"
        >
          Update
        </button>
      </div>
    </div>
    <div v-else-if="showViewContent">
      <!-- Nội dung xem sân bóng -->
      <n-message-provider>
        <ViewSanBong :data="viewData" />
        <button class="btn-close" @click="showViewContent = false">Đóng</button>
      </n-message-provider>
    </div>
    <div v-else>
      <h1>Quản Lý Sân</h1>
      <table>
        <!-- Bảng hiển thị danh sách sân bóng -->
        <thead>
          <tr class="header">
            <th>Tên Sân</th>
            <th>Địa Chỉ</th>
            <th>Khu vực</th>
            <!-- New field -->
            <th>Giá</th>
            <th>Số người</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(san, index) in visibleData" :key="index">
            <td>{{ san.name }}</td>
            <td>{{ san.address }}</td>
            <td>{{ san.area }}</td>
            <td>{{ san.price }}</td>
            <td>{{ san.people }}</td>
            <td>
              <button class="btn-xem" @click="viewSan(san)">
                <font-awesome-icon :icon="['fas', 'eye']" />
              </button>
              <button class="btn-sua" @click="editSan(san)">
                <font-awesome-icon :icon="['fas', 'file-pen']" />
              </button>
              <button class="btn-xoa" @click="deleteSan(san._id)">
                <font-awesome-icon :icon="['fas', 'trash']" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">
          <font-awesome-icon
            class="icon-pagination"
            :icon="['fas', 'arrow-left']"
          />
        </button>
        <span>Trang {{ currentPage }}</span>
        <button @click="nextPage" :disabled="currentPage * 10 >= data.length">
          <font-awesome-icon
            class="icon-pagination"
            :icon="['fas', 'arrow-right']"
          />
        </button>
      </div>
      <button class="btn-add" @click="showAddForm = true">Thêm Sân</button>
      <div v-if="showAddForm" class="add-san">
        <h2>Thêm Sân Mới</h2>
        <form @submit.prevent="saveNewSan" class="form-container">
          <div class="input-container">
            <input
              v-model="newSan.name"
              placeholder="Tên Sân"
              @input="validateName"
            />
            <p class="error">{{ formErrors.name }}</p>
          </div>
          <div class="input-container">
            <input
              v-model="newSan.address"
              placeholder="Địa Chỉ"
              @input="validateAddress"
            />
            <p class="error">{{ formErrors.address }}</p>
          </div>
          <div class="input-container">
            <input
              v-model="newSan.area"
              placeholder="Khu vực"
              @input="validateArea"
            />
            <p class="error">{{ formErrors.area }}</p>
          </div>
          <div class="input-container">
            <input
              v-model="newSan.price"
              placeholder="Giá"
              @input="validatePrice"
            />
            <p class="error">{{ formErrors.price }}</p>
          </div>
          <div class="input-container">
            <input
              v-model="newSan.people"
              placeholder="Số người"
              @input="validatePeople"
            />
            <p class="error">{{ formErrors.people }}</p>
          </div>
          <!-- Thêm các trường khác tương tự -->
          <div class="button-container">
            <button class="btn-luu" type="submit">
              <font-awesome-icon :icon="['fas', 'floppy-disk']" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import ViewSanBong from "../Manager/ViewSanBong.vue";
import axios from "axios";

export default {
  components: {
    ViewSanBong,
  },
  setup() {
    const selectedTab = ref("quan-ly-san");
    const showViewContent = ref(false);
    const viewData = ref();
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const userEmail = ref(userData.email);
    const data = ref([
      {
        name: "",
        address: "",
        people: "", // Add this field
        price: "", // Add this field
        area: "",
        imageSrc: "",
        description: {
          facilities: "",
          prices: "",
          transportation: "",
        },
      },
    ]);
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        // Kiểm tra xem kích thước tệp có vượt quá giới hạn không (ví dụ: 5MB)
        const maxFileSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxFileSize) {
          // Hiển thị thông báo lỗi nếu kích thước vượt quá giới hạn
          console.error(
            "Kích thước tệp quá lớn. Vui lòng chọn một tệp nhỏ hơn 5MB."
          );
          // Xoá tệp đang chọn (tùy chọn)
          event.target.value = "";
          return;
        }

        // Tiếp tục xử lý tải lên hình ảnh
        const reader = new FileReader();
        reader.onload = () => {
          // Đặt dữ liệu hình ảnh vào trường imageSrc của data
          data.value.imageSrc = reader.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const showAddForm = ref(false);
    const currentPage = ref(1);
    const visibleData = computed(() => {
      const start = (currentPage.value - 1) * 10;
      const end = start + 10;
      return data.value.slice(start, end);
    });

    const newSan = ref({
      email: "",
      name: "",
      address: "",
      people: "", // Add this field
      price: "", // Add this field
      area: "", // Add this field
      imageSrc: "",
      description: {
        facilities: "",
        prices: "",
        transportation: "",
      },
      // Thêm các trường khác tương tự
    });
    const viewSan = (san) => {
      viewData.value = san;
      showViewContent.value = true;
    };
    const editSan = (san) => {
      data.value = { ...data.value, ...san }; // Sao chép dữ liệu của sân bóng để chỉnh sửa
      selectedTab.value = "sua-san"; // Chuyển sang tab chỉnh sửa sân bóng
    };
    const cancelEdit = () => {
      if (selectedTab.value === "sua-san") {
        // Nếu đang ở trong chế độ chỉnh sửa sân
        selectedTab.value = "quan-ly-san"; // Chuyển về chế độ quản lý sân
      } else if (showAddForm.value) {
        // Nếu đang trong quá trình thêm sân
        showAddForm.value = false; // Tắt form thêm sân và trả về trạng thái ban đầu
        newSan.value = {
          email: "",
          name: "",
          address: "",
          people: "", // Add this field
          price: "", // Add this field
          area: "", // Add this field
          imageSrc: "",
          description: {
            facilities: "",
            prices: "",
            transportation: "",
          },
        };
      } else if (showViewContent.value) {
        // Nếu đang ở chế độ xem sân
        showViewContent.value = false; // Tắt chế độ xem sân
      }
    };

    const formErrors = ref({
      email: "",
      name: "",
      address: "",
      people: "", // Add this field
      price: "", // Add this field
      area: "", // Add this field
      description: {
        facilities: "",
        prices: "",
        transportation: "",
      },
      // Thêm các trường khác tương tự
    });

    // Function to fetch the product data from the API
    const fetchProductData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        data.value = response.data.filter(
          (san) => san.email === userEmail.value
        );
        console.log(data);
        console.log("Email từ sessionStorage:", userEmail.value);
      } catch (error) {
        console.error(error);
      }
    };

    const saveNewSan = async () => {
      try {
        // Thiết lập email từ sessionStorage cho newSan
        newSan.value.email = userEmail.value;

        const response = await axios.post(
          "http://localhost:5000/api/products",
          newSan.value
        );
        if (response.status === 201) {
          // Lưu sản phẩm mới thành công
          data.value.push(newSan.value); // Thêm sản phẩm mới vào mảng data
          showAddForm.value = false; // Tắt form thêm sản phẩm
          newSan.value = {
            name: "",
            address: "",
            area: "",
            price: "",
            people: "" /* thêm các trường khác */,
          };
        } else {
          console.error("Lỗi khi lưu sản phẩm mới");
        }
      } catch (error) {
        console.error("Lỗi khi lưu sản phẩm mới:", error);
      }
    };

    const updateSan = async () => {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/products/${data.value._id}`,
          data.value
        );
        if (response.status === 200) {
          // Cập nhật sản phẩm thành công
          fetchProductData(); // Cập nhật danh sách sản phẩm sau khi cập nhật
          selectedTab.value = "quan-ly-san"; // Chuyển về tab quản lý sản phẩm
        } else {
          console.error("Lỗi khi cập nhật sản phẩm");
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
      }
    };
    // Fetch the product data when the component is mounted
    fetchProductData();
    const deleteSan = async (_id) => {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/products/${_id}`
        );
        if (response.status === 200) {
          // Xóa thành công, cập nhật danh sách sản phẩm hoặc thực hiện các thao tác khác
          fetchProductData(); // Cập nhật danh sách sản phẩm sau khi xóa
        } else {
          console.error("Lỗi khi xóa sản phẩm");
        }
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
      }
    };

    return {
      selectedTab,
      showViewContent,
      viewData,
      data,
      showAddForm,
      currentPage,
      visibleData,
      newSan,
      formErrors,
      fetchProductData,
      saveNewSan,
      updateSan,
      viewSan,
      editSan,
      cancelEdit,
      deleteSan,
      handleImageUpload,
    };
  },
};
</script>

<style scoped>
.error {
  color: red;
  font-size: 14px;
}

.wrapper {
  height: auto;
  padding: 15px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  font-family: Arial, sans-serif;
  text-align: center;
}

.wrapper h1 {
  padding: 20px 10px;
  font-size: 30px;
  font-weight: 500;
}

.table-container {
  display: grid;
  grid-template-columns: 50px 200px 300px 100px auto;
  text-align: center;
}

.header th {
  padding: 10px;
  background-color: #f2f2f2;
  font-weight: 500;
  border: 1px solid #ddd;
}

table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
  text-align: left;
}

th,
td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

button {
  cursor: pointer;
}

.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  margin: 0 10px;
}

.icon-pagination {
  padding: 0 10px;
}

.icon-pagination:hover {
  font-size: 17px;
  color: rgb(250, 69, 22);
}

.btn-sua {
  padding: 1px 3px;
  margin: 0px 3px;
}

.btn-xoa {
  padding: 1px 3px;
  margin: 0px 3px;
}

.btn-sua:hover {
  color: rgb(250, 69, 22);
}

.btn-xoa:hover {
  color: rgb(250, 69, 22);
}

.btn-xem {
  padding: 1px 3px;
  margin: 0px 3px;
}

.btn-xem:hover {
  color: rgb(250, 69, 22);
}

.btn-add {
  padding: 5px 10px;
  margin: 15px 0px;
  border: 1px solid #ccc;
  border-radius: 0.3rem;
}

.btn-close {
  padding: 5px 10px;
  margin: 15px 0px;
  border: 1px solid #ccc;
  border-radius: 0.3rem;
}

.btn-close:hover {
  background-color: rgb(250, 69, 22);
  color: #fff;
}

.btn-add:hover {
  background-color: rgb(250, 69, 22);
  color: #fff;
}

.add-san {
  height: 150px;
}

.add-san h2 {
  font-size: 18px;
  padding: 10px;
  font-weight: 550;
}

.add-san form {
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 0.2rem;
}

.add-san form input {
  padding: 5px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 0.2rem;
}

.btn-luu {
  padding: 5px 0px 0px 20px;
  font-size: 25px;
}

.btn-quanlysan {
  background-color: rgb(250, 69, 22);
  color: #000;
}

.btn-quanlysan:hover {
  background-color: rgb(255, 119, 84);
  color: #fff;
}

.btn-luu:hover {
  color: rgb(250, 69, 22);
}

.form-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.input-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.input-container input {
  padding: 5px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 0.2rem;
}

.sua-header {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Change this as per your needs */
  gap: 10px; /* Adjust the gap as needed */
  align-items: center;
  padding: 10px;
}

.sua-header span {
  font-size: 20px;
  text-align: left;
}

.sua-header input {
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  padding: 8px 5px;
  width: 100%;
}

.sua-footer {
  justify-content: space-between; /* Điều chỉnh để phù hợp với sự căn chỉnh mong muốn của bạn */
  align-items: center;
  padding: 10px;
}

/* Adjust the following styles based on your requirements */
.sua-san {
  background-color: #fff;
  padding: 20px 10px;
  margin-bottom: 20px;
  max-height: 800px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 0.375rem;
}

.sua-san h1 {
  background-color: rgb(245, 116, 11);
  color: #fff;
  padding: 10px;
  font-size: 30px;
  font-weight: 500;
}

.sua-anh {
  padding: 20px 10px;
}

.date-time {
  padding: 5px;
  border-radius: 0.375rem;
  font-size: 50px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

dialog input {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
