import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from "axios";
import Echarts from "vue-echarts"
import "echarts";
import {createPinia} from 'pinia'



const app = createApp(App)
const pinia=createPinia()
app.use(pinia)
app.use(router)
app.use(ElementPlus)
axios.defaults.baseURL="http://43.138.152.69:8080/"
axios.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },function (error){
        return Promise.reject(error)
    }
)
app.component('Echarts',Echarts)
app.mount('#app')
