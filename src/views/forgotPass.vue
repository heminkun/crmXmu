<template>
  <div class="max-login">
    <video autoplay muted loop src="http://img.gvb-go.asia/study/static/%E8%A7%86%E9%A2%91/1090723.mp4"></video>
    <div class="login">
      <div class="flex" style="margin: auto; width: 100%;justify-content: center;">
        <div style="width: 80%; margin: auto">
          <el-steps finish-status="success" :active=state.step>
            <el-step title="提交邮箱验证码"/>
            <el-step title="更改密码"/>
            <el-step title="返回登录"/>
          </el-steps>
        </div>
      </div>
      <div class="login-from" style="width: 60%">
      <el-form v-if="state.step==0" :model="state.form" ref="formRef" :rules="formRules">
        <el-form-item prop="email" label="邮 箱：">
          <el-input placeholder="请填写邮箱" v-model="state.form.email">
          </el-input>
        </el-form-item>
        <el-form-item prop="code" label="验证码：">
          <el-input placeholder="请填写验证码" v-model="state.form.code">
            <template #append >
              <el-button @click="sendEmail" :disabled="state.button.disabled">{{state.button.buttonText}}</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="submit" plain type="primary" style="width: 600px;height: 35px">提交</el-button>
        </el-form-item>
      </el-form>
        <el-form ref="passFormRef" :rules="passFormRules" :model="state.passForm" v-if="state.step==1">
          <el-form-item label="密码：" prop="pass">
            <el-input type="password" show-password placeholder="请输入密码" v-model="state.passForm.pass"></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="okPass">
            <el-input type="password" show-password placeholder="请再次输入密码" v-model="state.passForm.okPass"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="forgotPassSubmit" style="width: 600px;" plain type="primary">确认修改</el-button>
          </el-form-item>
        </el-form>
      </div>
      <hr>
      <div style="height: 60px;">
        <a style="color: #00AEEC;font-size: 12px;text-decoration: none; text-align: right" href="/login">返回登录</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import {reactive, ref} from "vue";
import axios from "axios";
import {ElLoading, ElMessage, ElNotification} from "element-plus";
import {useRouter,useRoute} from "vue-router"

const router=useRouter();
const route=useRoute();

let passGrep = /^[a-zA-Z0-9_.-=*&^%$#@!+]{6,18}$/;
let emailGrep = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;


const state=reactive({
  passForm:{
    pass:"",
    okPass:""
  },
  step:0,
  form:{
    email:"",
    code:'',
  },
  button:{
    buttonText: '获取验证码', // 按钮文本
    disabled: true, // 是否禁用按钮
    countDownSeconds: 60 // 倒计时秒数
  }
})

const passFormRef=ref()
const validatePass = (rule,value,callback) => {
  if (!value){
    callback(new Error("请填写该字段"))
  }else {
    if (passGrep.test(value)){
      callback()
    }else {
      callback(new Error("密码6~18位字母、数字、特殊字符组成"))
    }
  }
}
const validateOkPass = (rule,value,callback) => {
  if (!value){
    callback(new Error("请填写该字段"))
  }else {
    if (value!==state.passForm.pass){
      callback(new Error("两次密码不一致！"))
    }else {
      callback()
    }
  }
}

const passFormRules=reactive({
  pass:[{validator:validatePass,trigger:'blur'}],
  okPass:[{validator:validateOkPass,trigger:'blur'}]
})

const formRef=ref()
const countDown=()=>{
  // 每秒钟更新倒计时
  if (state.button.countDownSeconds > 0) {
    setTimeout(() => {
      state.button.countDownSeconds--
      state.button.buttonText = `${state.button.countDownSeconds} s`
      countDown()
    }, 1000)
  } else {
    // 时间到后解除禁用
    state.button.buttonText = '获取验证码'
    state.button.disabled = false
    state.button.countDownSeconds = 60
  }
}
const sendEmail=()=>{
  state.button.disabled=true
  countDown()
  axios.get("email/forgotPass",{params:{
      email:state.form.email
    }}).then((res)=>{
      if (res.data.code!=200){
        ElMessage.error(res.data.info)
      } else {
        ElMessage.success("邮件已发送,请注意查收")
      }
  })
}
const validateEmail = (rule,value,callback) => {
  if (!value){
    state.button.disabled=true
    return callback(new Error("请填写此字段~"))
  }else {
    if (emailGrep.test(value)){
      axios.get("/sysUser/validateEmail",{params:{
          email:value
        }}).then((res)=>{
          console.info(res.data)
          if (res.data.code!=200){
            return callback(new Error("该邮箱并没有在本网站注册"))
          }else {
            state.button.disabled=false
            callback()
          }
      })
    }else {
      callback(new Error("请填写正确的邮箱格式"))
    }
  }
}
const validateCode = (rule,value,callback) => {
  if (!value){
    return callback(new Error("请填写此字段~"))
  }else {
    callback()
  }
}
const formRules =reactive({
  email:[{validator:validateEmail,trigger:'blur'}],
  code:[{validator:validateCode,trigger:'blur'}]
})


const submit = () => {
  formRef.value.validate((valid)=>{
    if (valid){
        axios.get("sysUser/forgotPassCode",{params:{
            email:state.form.email,
            code:state.form.code
          }}).then((res)=>{
            if (res.data.code!=200){
              ElMessage.error(res.data.data)
            }else {
              const loading = ElLoading.service({
                lock: true,
                text: 'Loading',
                background: 'rgba(0, 0, 0, 0.7)',
              })
              setTimeout(() => {
                loading.close()
                state.step=1
                console.info(state.form.email)
              }, 2000)
            }
        })
    }
  })
}
const forgotPassSubmit = () => {
  passFormRef.value.validate((valid)=>{
    if (valid){
      axios.get("sysUser/forgotPass",{params:{
          email:state.form.email,
          pass:state.passForm.pass
        }}).then((res)=>{
          if (res.data.code!=200){
            ElMessage.error(res.data.info)
          }else {
            ElNotification({
              type:"success",
              title:"找回成功！",
              message:"即将跳转至登录页面,使用您的新密码进行登录吧！"
            })
            const loading = ElLoading.service({
              lock: true,
              text: 'Loading',
              background: 'rgba(0, 0, 0, 0.7)',
            })
            setTimeout(() => {
              loading.close()
              router.push("/login")
            }, 2000)
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
    width: 700px;
    height: 450px;
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