import { createApp, ref } from "vue";
import "./assets/css/style.css";
import App from "./App.vue";
import naive from "naive-ui";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faLocationDot,
  faEnvelope,
  faPhone,
  faCreditCard,
  faUser,
  faArrowRightFromBracket,
  faUserPen,
  faTag,
  faHeadphones,
  faFileInvoiceDollar,
  faFutbol,
  faFilePen,
  faSave,
  faArrowRight,
  faArrowLeft,
  faTrash,
  faFloppyDisk,
  faEye,
  faCartShopping,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

import {
  faTwitter,
  faGooglePlus,
  faSquareInstagram,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
library.add(
  faLocationDot,
  faEnvelope,
  faPhone,
  faFacebook,
  faTwitter,
  faSquareInstagram,
  faGooglePlus,
  faCreditCard,
  faUser,
  faArrowRightFromBracket,
  faUserPen,
  faTag,
  faHeadphones,
  faFileInvoiceDollar,
  faFutbol,
  faFilePen,
  faSave,
  faArrowRight,
  faArrowLeft,
  faTrash,
  faFloppyDisk,
  faEye,
  faCartShopping,
  faGear,
);
import { createRouter, createWebHistory } from "vue-router";
import BookingBallLayout from "./components/DatSanBong/BookingBallLayout.vue";
// import DetailBall from "./components/ChiTietSan/DetailBall.vue";
import FieldBooking from "./components/ChiTietSan/FieldBooking.vue";
import Home from "./views/index.vue";
import AboutUsVue from "./components/AboutUs.vue";
import ThanhToanBall from "./components/ThanhToan/ThanhToanBall.vue";
import Login from "./components/Account/Login.vue";
import Register from "./components/Account/Register.vue";
import UserProfile from "./components/Profile/User/UserProfile.vue";
import ManageProfile from "./components/Profile/Manager/ManageProfile.vue";
import LoginAdmin from "./components/Admin/login.vue";
import HomeAdmin from "./components/Admin/home.vue";
import Fields from "./components/Admin/Fields.vue";
import BookingDetail from "./components/Admin/Bookings.vue";
import Revenue from "./components/Admin/Revenue.vue";
import FieldRevenue from "./components/Admin/FieldRevenue.vue";
import ConTact from "./components/ConTact.vue";
import userManager from "./components/Admin/userManager.vue";
import DetailNew from "./components/FootBallNews/DetailNew.vue";
import CategoryVue from "./components/QuanAo/Category.vue";
import { create } from "naive-ui";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
      alias: "/home",
    },
    { path: "/bookingball", component: BookingBallLayout },
    { path: "/detailball/:id", component: FieldBooking },
    {
      path: "/detailball/:id/thanhtoanball/:sanId/:selectDate/:selectTime",
      component: ThanhToanBall,
      name: "thanhtoanball",
      props: true,
    },
    { path: "/aboutus", component: AboutUsVue },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/contact", component: ConTact },
    { path: "/user", component: UserProfile },
    { path: "/manage", component: ManageProfile },
    { path: "/admin", component: LoginAdmin },
    { path: "/admin/home", component: HomeAdmin },
    { path: "/Fields", component: Fields },
    { path: "/bookingDetail", component: BookingDetail },
    { path: "/Revenue", component: Revenue },
    { path: "/userManager", component: userManager },
    { path: "/Revenue/:name", name: "FieldRevenue", component: FieldRevenue },
    { path: "/tintuc", component: DetailNew },
    { path: "/quanao", component: CategoryVue },
  ],
});

library.add(
  faLocationDot,
  faEnvelope,
  faPhone,
  faFacebook,
  faTwitter,
  faSquareInstagram,
  faGooglePlus,
  faCreditCard,
);
const app = createApp(App);
// Tạo biến isLoggedIn để theo dõi trạng thái đăng nhập
const isLoggedIn = ref(false);
app.config.globalProperties.$isLoggedIn = isLoggedIn;

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(naive);
app.use(create());
app.use(router);
app.mount("#app");
// app.component(NPagination.name, NPagination);
