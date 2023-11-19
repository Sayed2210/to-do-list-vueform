import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//tailwind
import "./assets/tailwind.css";
//vueform
import Vueform from "@vueform/vueform";
import vueformConfig from "./../vueform.config";

createApp(App).use(store).use(Vueform, vueformConfig).use(router).mount("#app");
