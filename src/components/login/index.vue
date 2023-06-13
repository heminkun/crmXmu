<template>
  <div class="max-login">
    <video autoplay muted loop src="http://img.gvb-go.asia/study/static/%E8%A7%86%E9%A2%91/1090723.mp4"></video>
    <div class="login">
      <div style="margin: auto;">
        <h1 style="color:#00AEEC;">登录</h1>
      </div>
      <div class="login-from">

      <el-form :model="form" ref="formFef" :rules="rules" style="width: 240px">
        <el-form-item prop="username">
          <el-input v-model="form.username" type="text" placeholder="请输入用户名或邮箱">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              show-password
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @mouseover="fontcolorOver" @mouseout="fontcolorOut" @click="login" plain style="margin: auto;width: 200px" type="primary">
            <span :style="fontcolor.color">登录</span>
          </el-button>
        </el-form-item>
      </el-form>
      </div>
      <a style="color: #00AEEC;font-size: 12px;text-decoration: none; text-align: left;position: absolute;bottom: 62px " href="/register">没有账号？</a>
      <a style="color: #00AEEC;font-size: 12px;text-decoration: none; text-align: right" href="/forgotPass">忘记密码？</a>

      <hr>
      <div style="height: 60px;">

      </div>
    </div>
  </div>
</template>

<script setup>
import {User, Lock} from '@element-plus/icons-vue'
import {reactive, ref} from "vue";
import axios from "axios";
import {ElLoading, ElMessage, ElNotification} from "element-plus";
import {useRouter,useRoute} from "vue-router";

const router=useRouter();
const route=useRoute();



const fontcolor=reactive({
  color:"color: #00AEEC;"
})

const fontcolorOver=()=>{
  fontcolor.color="color: #fff;"
}
const fontcolorOut=()=>{
  fontcolor.color="color: #00AEEC;"
}

const formFef=ref('')



const form = reactive({
  username: '',
  password: '',
})
const validateUsername = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请填写此字段~'))
  } else {
      callback()
    }
}
const validatePassword=(rule,value,callback)=>{
  if (!value){
    return callback(new Error('请填写此字段~'))
  }else {
    callback()
  }
}



const rules=reactive({
  username:[{validator:validateUsername,trigger:'blur'}],
  password:[{validator:validatePassword,trigger:'blur'}]
})
function login(){
  formFef.value.validate((valid)=>{
    if (valid){

      axios.get("sysUser/login",{params:{
          text:form.username,
          password:form.password
        }}).then((res)=>{
          if (res.data.code!=500){
            if (res.data.data!=null) {
              localStorage.setItem("token",res.data.data)
              const loading = ElLoading.service({
                lock: true,
                text: 'Loading',
                background: 'rgba(0, 0, 0, 0.7)',
              })
              ElNotification({
                type:"success",
                title:"登录成功",
                message:"即将跳转至主页"
              })
              setTimeout(() => {
                loading.close()
                router.push("/")
              }, 2000)
            }else {
              ElMessage.warning("用户名或密码错误")
            }
          }else {
            ElMessage.error(res.data.info)
          }
      })
    }

  })
}

</script>

<style lang="scss">
video{
  height: 100%;
  width: 100%;
  object-fit: cover;
  position: fixed;
  left: 0;
  top: 0;
}
.max-login{
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  background-size:cover;
  .login{
    //border: 1px solid red;
    width: 400px;
    height: 350px;
    margin: auto;
    background-color: rgba(255,255,255,0.8);
    border-radius:10px;
    box-shadow: 0 0 2px 2px #888888;
    display: flex;
    justify-content: center;
    flex-direction: column;
    position: relative;
    .login-from{
        margin: auto;
    }
  }
}

</style>