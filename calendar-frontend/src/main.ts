import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.css";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";

import "./assets/main.scss";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "@mdi/font/css/materialdesignicons.css";

const vuetify = new Vuetify();

Vue.use(Vuetify);

axios.defaults.baseURL = "http://localhost:3000";

const accessToken = localStorage.getItem("acces_token");
if (accessToken) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
  router.push({ path: "/calendar" });
}

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
