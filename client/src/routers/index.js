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
        path: ":id/thanhtoanball",
        component: () =>
          import("../components/ThanhToan/ThanhToanBall.vue"),
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
      },{
        path:"UserManager",
        component:() => import("../components/Admin/UserManager.vue")
      }
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
