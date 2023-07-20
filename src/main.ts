import Vue from "vue";
import App from "./App.vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import router from "./router/index-EAP_TARGET.ts";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import "./assets/styles/index.scss";

Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
