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

import Home from "./views/index.vue";
import FieldBooking from "./views/field-booking/index.vue";
import FieldBookingDetail from "./views/field-booking/components/Booking.vue";
import Store from "./views/store/index.vue";
import NewsDetail from "./views/home/components/NewsDetail.vue";
import AboutUs from "./views/home/components/AboutUs.vue";
import Login from "./views/login/index.vue";
import Contact from "./views/contact/index.vue";
import UserProfile from "./views/profile/index.vue";
import HomeAdmin from "./views/admin/index.vue";

import { create } from "naive-ui";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
      alias: "/home",
    },
    { path: "/bookingball", component: FieldBooking },
    { path: "/detailball/:id", component: FieldBookingDetail },
    { path: "/store", component: Store },
    { path: "/tintuc", component: NewsDetail },
    { path: "/aboutus", component: AboutUs },
    { path: "/login", component: Login },
    { path: "/contact", component: Contact },
    { path: "/user", component: UserProfile },
    { path: "/admin/home", component: HomeAdmin }
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

const cartItems = ref([]);
app.provide('cartItems', cartItems)

const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(naive);
app.use(create());
app.use(router);
app.mount("#app");
