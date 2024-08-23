import { createApp, ref } from 'vue';
import './assets/css/style.css';
import App from './App.vue';
import naive from 'naive-ui';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
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
  faGear
} from '@fortawesome/free-solid-svg-icons';

import { faTwitter, faGooglePlus, faSquareInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
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
  faGear
);

import { create } from 'naive-ui';
import router from './routers';

library.add(faLocationDot, faEnvelope, faPhone, faFacebook, faTwitter, faSquareInstagram, faGooglePlus, faCreditCard);
const app = createApp(App);

const cartItems = ref([]);
app.provide('cartItems', cartItems);

const meta = document.createElement('meta');
meta.name = 'naive-ui-style';
document.head.appendChild(meta);

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(naive);
app.use(create());
app.use(router);
app.mount('#app');
