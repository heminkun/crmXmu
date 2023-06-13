<template>
  <div style="height: 60px;position: relative; box-shadow: rgba(0, 0, 0, 0.1) 6px 0 10px;justify-content: right" class="baise flex">
    <div class="flex" style="width: 300px;height: 100%;">
          <div @click="jumpPersonal" class="flex" style="height: 100%;justify-content: flex-end">

              <a style="text-decoration: none;color: #909190;align-items: center;" class="flex" href="#">
              <el-avatar :size="40" :src="state.ico"/>
                <div style="padding: 15px">{{state.username}}</div>
              </a>
          </div>
      <div class="flex1 flex" style="align-items: center;justify-content: center;font-size: 14px">
        <el-popconfirm
            confirm-button-text="Yes"
            cancel-button-text="No"
            title="是否要退出？"
            @confirm="confirmEvent"
        >
          <template #reference>
        <div style="cursor: pointer" @mouseout="logoutOut" @mouseover="logoutOver">
        <el-icon size="15px" style="padding: 5px" :color="logoutStyle.iconStyle"><SwitchButton /></el-icon>
          <span :style="logoutStyle.style">
            退出
          </span>
        </div>
          </template>
        </el-popconfirm>
      </div>
    </div>
  </div>
</template>

<script setup>

import {reactive} from "vue";
import {SwitchButton} from "@element-plus/icons-vue";
import axios from "axios";

import {useRouter,useRoute} from "vue-router";
import {ElLoading, ElMessage} from "element-plus";

import {useUserStore} from "@/stores";

const userStore=useUserStore()


const jumpPersonal = () => {
  router.push("/personal")
}

const router=useRouter();
const route=useRoute();

const logoutStyle=reactive({
  style:"color: #909190;",
  iconStyle:"#909190"
})
const state=reactive({
  username:'',
  ico:''
})
const confirmEvent = () => {
  axios.get("sysUser/logout",{params:{
      username:state.username
    }}).then(()=>{
    localStorage.clear()
    sessionStorage.clear()
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    setTimeout(()=>{
      loading.close()
      router.push("/login")
    },2000)

  })
}
let item = localStorage.getItem("token");
axios.get("sysUser/verifyToken",{params:{
  token:item
  }}).then((res)=>{
      if (res.data.code==500){
        ElMessage.error("身份验证已过期！请重新登录！")
        router.push("/login")
      }
      state.username=res.data.data.username
      state.ico=res.data.data.ico
      userStore.user.id=res.data.data.id
      userStore.user.username=res.data.data.username
      userStore.user.ico=res.data.data.ico
      userStore.user.email=res.data.data.email
      userStore.user.flag=res.data.data.flag
      userStore.user.roleId=res.data.data.roleId
})

const logoutOver=()=>{
  logoutStyle.style="color: #2FA7B9;"
  logoutStyle.iconStyle="#2FA7B9"
}
const logoutOut=()=>{
  logoutStyle.style="color: #909190;"
  logoutStyle.iconStyle="#909190"
}
</script>

<style scoped>

</style>