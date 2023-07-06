import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.css";

import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./assets/main.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "@mdi/font/css/materialdesignicons.css";

const vuetify = new Vuetify();

Vue.use(Vuetify);

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
