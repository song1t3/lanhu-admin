import Vue from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueCompositionApi from "@vue/composition-api"; //vue3.0插件
import "./router/premit";
// 自定义全局方法
// import global from "@/utils/global";
import "@/icons/"; //自定义全局组件引入
//使用插件
Vue.use(ElementUI);
Vue.use(VueCompositionApi);
// Vue.use(global);
Vue.config.productionTip = false;

//runtime(运行模式)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
