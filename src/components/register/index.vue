<template>
  <div class="max-login">
    <video autoplay muted loop src="http://img.gvb-go.asia/study/static/%E8%A7%86%E9%A2%91/1090723.mp4"></video>
    <div class="login">
      <div style="margin: auto;">
        <h1 style="color:#00AEEC;">注册</h1>
      </div>
      <div class="login-from">
        <el-form :model="form" :rules="rules" ref="formDataRef" style="width: 250px">
          <el-form-item prop="email">
            <el-input v-model="form.email" type="text" placeholder="请输入邮箱">
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="username">
            <el-input v-model="form.username" type="text" placeholder="请输入用户名">
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
          <el-form-item prop="password2">
            <el-input
                show-password
                v-model="form.password2"
                type="password"
                placeholder="请再次输入密码"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="verification">
            <el-input v-model="form.verification" placeholder="请输入验证码">
              <template #prefix>
                <el-icon><ChatDotRound /></el-icon>
              </template>
              <template #append>
                <el-button @click="sendEmail" :disabled="button.disabled" size="small" type="primary">{{button.buttonText}}</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="register" plain style="margin: auto;color: black;width: 200px" type="primary">
              注册
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <a style="color: #00AEEC;font-size: 12px;text-decoration: none; text-align: left;position: absolute;bottom: 32px " href="/login">已有账号？</a>
      <a style="color: #00AEEC;font-size: 12px;text-decoration: none; text-align: right" href="">忘记密码？</a>
      <div style="height: 30px"></div>
    </div>
  </div>
</template>

<script setup>
import {User, Lock,Message,ChatDotRound} from '@element-plus/icons-vue'
import {reactive,ref} from "vue";
import axios from "axios";
import {useRouter,useRoute} from "vue-router";
import {ElLoading, ElMessage, ElNotification} from "element-plus";

const router=useRouter();
const route=useRoute();

let nameGrep = /^[\u4e00-\u9fa5a-zA-Z0-9_]{2,8}$/;
// 邮箱正则表达式判断
let emailGrep =
    /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
// 密码正则表达式判断
let passGrep = /^[a-zA-Z0-9_.-=*&^%$#@!+]{6,18}$/;


const button=reactive({
  buttonText: '获取验证码', // 按钮文本
  disabled: true, // 是否禁用按钮
  countDownSeconds: 60 // 倒计时秒数
})

const formDataRef=ref('');

const form = reactive({
  email:"",
  username: '',
  password: '',
  password2: '',
  verification:''
})
const countDown=()=>{
  // 每秒钟更新倒计时
  if (button.countDownSeconds > 0) {
    setTimeout(() => {
      button.countDownSeconds--
      button.buttonText = `${button.countDownSeconds} s`
      countDown()
    }, 1000)
  } else {
    // 时间到后解除禁用
    button.buttonText = '获取验证码'
    button.disabled = false
    button.countDownSeconds = 60
  }
}
const sendEmail=()=>{
  button.disabled = true
  countDown()
  axios.get("/email/send",{params:{
      email:form.email
    }}).then(()=>{
    ElMessage.success("邮件已发送，请注意查收")
  })
}
const validateEmail = (rule, value, callback) => {
  if (!value) {
    button.disabled=true
    return callback(new Error('请填写此字段~'))
  } else {
    if (!emailGrep.test(value)) {
      button.disabled=true
      callback(new Error('请按照正确的邮箱格式输入'));
    } else {
      axios.get("/sysUser/loadDataList", {params:{
          userEmail:form.email
        }}).then((res)=>{
        if (res.data.data.totalCount>0){
          button.disabled=true
          callback(new Error("该邮箱已被注册"))
        }else {
          button.disabled=false
          callback()
        }
      })

    }
  }
}
const validateUsername=(rule,value,callback)=>{
  if (!value){
    return callback(new Error("请填写此字段~"))
  }else{
    if(!nameGrep.test(value)){
      callback(new Error("用户名由2~8位中英文、数字、下划线组成"))
    }else{
      axios.get("/sysUser/loadDataList",{params:{
          userName:form.username
        }}).then((res)=>{
          if (res.data.data.totalCount>0){
            callback(new Error("这个名字太热门了，已被注册~"))
          }else {
            callback()
          }
      })
    }
  }
}

const validatePassword=(rule,value,callback)=>{
  if (!value){
    return callback(new Error("请填写此字段~"))
  }else{
    if (!passGrep.test(value)){
      callback(new Error("密码6~18位字母、数字、特殊字符组成"))
    }else{
      callback()
    }
  }
}
const validatePassword2 = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请填写此字段~'))
  } else {
    if (value!==form.password){
      callback(new Error("两次密码不一致！"))
    }
    else {
      callback()
    }
  }
}
const validateVerification=(rule,value,callback)=>{
  if (!value){
    return callback(new Error('请填写此字段~'))
  }else {
    callback()
  }
}
const rules=reactive({
  email:[{validator:validateEmail,trigger:'blur'}],
  username:[{validator:validateUsername,trigger:'blur'}],
  password:[{validator:validatePassword,trigger:'blur'}],
  password2:[{validator:validatePassword2,trigger:'blur'}],
  verification:[{validator:validateVerification,trigger:'blur'}]
})
function register(){
    formDataRef.value.validate((valid) => {
      if (valid) {
        const params = {
          email: form.email,
          username: form.username,
          password: form.password,
          code: form.verification
        }
        axios.post("/sysUser/register", params).then((res) => {
          if (res.data.code == 500) {
            ElMessage.error(res.data.data)
          } else {
            formDataRef.value.resetFields()
            ElNotification({
              type:"success",
              title:"注册成功",
              message:"即将跳转至主页"
            })
            const loading = ElLoading.service({
              lock: true,
              text: 'Loading',
              background: 'rgba(0, 0, 0, 0.7)',
            })
            setTimeout(()=>{
              loading.close()
              router.push("/login")
            },2000)
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
    width: 450px;
    height: 470px;
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