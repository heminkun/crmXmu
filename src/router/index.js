import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:"/login",
      name:"login",
      component: () =>import('@/views/login.vue')
    },
    {
      path:"/register",
      name:"register",
      component:()=>import('@/views/Register.vue')
    },
    {
      path:'/forgotPass',
      name:"forgotPass",
      component:()=>import('@/views/forgotPass.vue')
    },
    {
      path:"/",
      name:"home",
      redirect:"/home",
      component:()=>import('@/views/Home.vue'),
      children:[
        {
          path:"/home",
          name:"index",
          component:()=>import('@/components/main/home/index.vue')
        },
        {
          path:"/personal",
          name:"personal",
          component:()=>import('@/components/main/Personal/index.vue')
        },
        {
          path:"/sale",
          name:"sale",
          component:()=>import('@/components/main/sale/index.vue')
        },
        {
          path:"/develop",
          name:"develop",
          component:()=>import('@/components/main/develop/index.vue')
        },
        {
          path:'/custom',
          name:'custom',
          component:()=>import('@/components/main/custom/index.vue')
        },
        {
          path:'/wastage',
          name:'wastage',
          component:()=>import('@/components/main/wastage/index.vue')
        },
        {
          path:"/addService",
          name:"addService",
          component:()=>import('@/components/main/service/addservice/index.vue')
        },
        {
          path:"/allocation",
          name:"allocation",
          component:()=>import('@/components/main/service/allocationService/index.vue')
        },
        {
          path:"/handle",
          name:"handle",
          component:()=>import('@/components/main/service/handleService/index.vue')
        },
        {
          path:"/feedback",
          name:"feedback",
          component:()=>import('@/components/main/service/feedbackService/index.vue')
        },
        {
          path:"/filing",
          name:"filing",
          component:()=>import('@/components/main/service/filingService/index.vue')
        },
        {
          path:"/contribute",
          name:"contribute",
          component:()=>import('@/components/main/statistics/contribute/index.vue')
        },
        {
          path:"/constitute",
          name:"constitute",
          component:()=>import('@/components/main/statistics/constitute/index.vue')
        },
        {
          path:"/serviceType",
          name:"serviceType",
          component:()=>import('@/components/main/statistics/serviceType/index.vue')
        },
        {
          path:"/away",
          name:"away",
          component:()=>import('@/components/main/statistics/away/index.vue')
        },
        {
          path:"/dictionary",
          name:"dictionary",
          component:()=>import('@/components/main/basicData/dictionary/index.vue')
        },
        {
          path:"/product",
          name:"product",
          component:()=>import('@/components/main/basicData/product/index.vue')
        },
        {
          path:"/inventory",
          name:"inventory",
          component:()=>import('@/components/main/basicData/inventory/index.vue')
        },
        {
          path:"/sysSetup",
          name:"sysSetup",
          component:()=>import('@/components/main/sysSetup/index.vue')
        },
        {
          path:"/banner",
          name:"banner",
          component:()=>import('@/components/main/banner/index.vue')
        }
      ]
    },
    {
      path:"/test",
      name:"test",
      component:()=>import('@/views/test.vue')
    },
  ]
})

export default router