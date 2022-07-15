/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-10 12:04:35
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-11 17:15:36
 */
import { createApp } from 'vue'
import Dev from './serve.vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
// To register individual components where they are used (serve.vue) instead of using the
// library as a whole, comment/remove this import and it's corresponding "app.use" call

const app = createApp(Dev)
app.config.globalProperties.$ELEMENT = {
  size: 'small',
  zIndex: 3000,
}
app.mount('#app')
app.use(ElementPlus)
