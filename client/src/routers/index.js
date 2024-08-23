import { createRouter, createWebHistory } from 'vue-router';

import { getUserData } from '@/utils/common';

const routes = [
  {
    path: '/',
    component: () => import('@/views/index.vue'),
    alias: '/home'
  },
  { path: '/bookingball', component: () => import('@/views/field-booking/index.vue') },
  { path: '/detailball/:id', component: () => import('@/views/field-booking/components/Booking.vue') },
  { path: '/store', component: () => import('@/views/store/index.vue') },
  { path: '/tintuc', component: () => import('@/views/home/components/NewsDetail.vue') },
  { path: '/aboutus', component: () => import('@/views/home/components/AboutUs.vue') },
  { path: '/login', component: () => import('@/views/login/index.vue') },
  { path: '/contact', component: () => import('@/views/contact/index.vue') },
  { path: '/user', component: () => import('@/views/profile/index.vue') },
  {
    path: '/admin/home',
    component: () => import('@/views/admin/index.vue'),
    meta: {
      requiresAuth: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, _from) => {
  if (to.meta.requiresAuth && getUserData()?.role !== 'admin') {
    console.log('Không có quyền vào trang này');
    return { path: '/' };
  }
});

export default router;
