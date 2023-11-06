import { createRouter, createWebHistory } from "vue-router";
import App from "../App.vue";
const routes = [
  {
    path: "/app",
    component: App,
    children: [
      {
        path: "bookingball",
        name :"BookingBall",
        component: () =>
          import("../components/DatSanBong/BookingBallLayout.vue"),
      },
      {
        path: "detailball/:id",
        component: () => import("../components/ChiTietSan/DetailBall.vue"),
      },
      {
        path: 'detailball/:id/thanhtoanball/:sanId/:selectDate/:selectTime',
        name: 'thanhtoanball',
        component: () =>
          import("../components/ThanhToan/ThanhToanBall.vue"),
          props: true,
      },{
        path:'aboutus',
        component:()=> import("../components/AboutUs.vue")
      },
      {
        path:"login",
        component:() => import("../components/Account/Login.vue")
      },{
        path:"register",
        component:() => import("../components/Account/Register.vue")
      },
      {
        path: '/home',
        name: 'Home',
        component:() => import ("../components/TheHeader.vue")
      },
      {
        path: "user",
        component: () => import("../components/Profile/UserProfile.vue"),
      },
      {
        path:"manage",
        component: () => import("../components/Profile/Managers/ManageProfile.vue")
      },
      {
        path: "contact",
        component: () => import("../components/ConTact.vue"),
      },
      
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
