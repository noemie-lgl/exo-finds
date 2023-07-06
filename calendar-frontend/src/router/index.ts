import Vue from "vue";
import VueRouter from "vue-router";
import RegisterView from "../views/RegisterView.vue";
import CalendarView from "../views/CalendarView.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Register",
      component: RegisterView,
    },
    {
      path: "/calendar",
      name: "Calendar",
      component: CalendarView,
    },
  ],
});

export default router;
