<template>
  <div class="flex flexrow" style="height: 93%;width:100%; justify-content: space-evenly">
    <div class="flex baise center" style="height: 600px;width: 70%;">
      <div class="flex" style="width: 90%;height: 100%">
        <div class="flex column" style="justify-content: space-evenly;width: 100%">
          <div class="flex"><el-icon size="30px"><User/></el-icon><h3>个人设置</h3></div>
          <div class="flex column">
            <span style="padding-bottom: 20px">基本设置</span>
            <el-form ref="usernameFormRef" :rules="usernameRules" :model="usernameForm" class="flex flexrow">
              <el-form-item prop="username" label="名称：">
                <el-input placeholder="请输入名称" v-model="usernameForm.username" size="small"></el-input>
              </el-form-item>
              <el-form-item style="padding-left: 20px">
                <el-button @click="usernameSubmit" size="small">提交</el-button>
              </el-form-item>
            </el-form>
          </div>
          <hr style="border: 0.1px dashed #909190">
          <div class="flex column">
            <span>绑定邮箱</span>
            <span>已绑定邮箱：{{userStore.user.email}}</span>
            <span>邮箱作为您身份验证的重要方式，请谨慎操作！</span>
            <el-form v-show="SwitchEmail.code" :rules="emailRules" ref="emailFormRef" :model="emailForm" class="flex" style="width: 40%;">
              <el-form-item prop="email" label="验证码：">
                <el-input placeholder="请输入邮箱验证码" v-model="emailForm.email" size="small">
                  <template #append><el-button @click="sendEmail" :disabled="button.disabled" size="small">{{ button.buttonText }}</el-button></template>
                </el-input>
              </el-form-item>
              <el-form-item style="padding-left: 20px">
                <el-button @click="emailSubmit" size="small">提交</el-button>
              </el-form-item>
            </el-form>
            <el-form v-show="!SwitchEmail.code" :rules="NewEmailRules" ref="NewEmailFormRef" :model="NewEmailForm" class="flex">
              <el-form-item prop="email" label="邮箱：">
                <el-input placeholder="请输入新邮箱" v-model="NewEmailForm.email" size="small">
                </el-input>
              </el-form-item>
                    <el-form-item prop="code" label="请输入验证码：" style="padding-left: 20px">
                      <el-input placeholder="验证码" v-model="NewEmailForm.code" size="small">
                        <template #append><el-button @click="NewEmailSend" :disabled="newButton.disabled" size="small">{{ newButton.buttonText }}</el-button></template>
                      </el-input>
                    </el-form-item>
              <el-form-item style="padding-left: 20px">
                <el-button @click="changeEmail" size="small">提交</el-button>
              </el-form-item>
            </el-form>
          </div>
          <hr style="border: 0.1px dashed #909190">
          <div class="flex column">
            <span>修改密码</span>
            <span>密码6~18位字母、数字、特殊字符组成</span>
            <span>安全提示：新密码请勿与旧密码过于相似</span>
            <el-form :model="passForm" :rules="rulesPassForm" ref="refPassForm" class="flex flexrow">
              <el-form-item  prop="oldPassword" label="旧密码：" style="padding-right:30px ">
                <el-input type="password" placeholder="请输入旧密码" v-model="passForm.oldPassword" size="small"></el-input>
              </el-form-item>
              <el-form-item prop="newPassword" style="padding-right:20px " label="新密码">
                <el-input type="password" show-password placeholder="请输入新密码" v-model="passForm.newPassword" size="small"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="changePass" size="small">提交</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>

    <div class="flex baise center" style="height: 600px;width: 27%">
      <div class="flex" style="width: 85%;height: 90%">
        <div class="flex column" style="justify-content: space-evenly;height: 100%; width: 100%">
          <div class="flex">
            <el-icon size="30px"><ChatLineRound/></el-icon><h3>信息展示</h3>
          </div>

          <div class="flex" style="width: 100%;justify-content: center">
            <el-upload
            action="http://43.138.152.69:8080/qiniu/upload"
            :show-file-list="false"
            :on-success="handleSuccess"
            :on-error="handleError"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :data="userStore.user"
            accept="image/jpeg,image/png"
            :limit="1024 * 1024 * 5"
            v-loading="state.loading">
            <el-avatar :src="userStore.user.ico" :size="100"></el-avatar>
          </el-upload>

          </div>
          <div class="flex center">点击更换头像</div>
          <div class="flex column center">
            <h1>hi,{{ userStore.user.username }}</h1>
            <span>{{userStore.user.email}}</span>
          </div>
          <hr>
          <div class="flex">
            <el-icon size="30px"><ChatLineRound/></el-icon><h3>账号类型</h3>
          </div>
          <div class="flex column center">
            <h2>"{{Role.roleName}}"</h2>
            <span style="width: 200px;padding-top: 20px">&nbsp;&nbsp;&nbsp;&nbsp;{{Role.roleDesc}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ChatLineRound, User} from "@element-plus/icons-vue";
import {onMounted, reactive, ref} from "vue";
import {ElLoading, ElMessage, ElNotification} from "element-plus";
import axios from "axios";
import {useRouter,useRoute} from "vue-router";
import {useUserStore} from "@/stores";

const userStore=useUserStore();
const route=useRoute();
const router=useRouter();





const state=reactive({
  loading:false
})
const beforeUpload = () => {
    state.loading=true
}
const handleExceed = (res,file,files) => {
    ElNotification({
      title:"上传失败",
      type:"error",
      message:'只能上传一个文件,且文件大小不能超过5MB'
    })
    state.loading=false
}
const handleSuccess = (res, file, files) => {
  if (res.code!=500){
    ElNotification({
      title:"上传成功",
      type:"success",
      message:"头像更换成功,重新登录即可"
    })
    state.loading=false
  }else {
    ElNotification({
      type:"error",
      title:"上传失败",
      message:"文件大小不能超过5MB,必须是jpg,jpeg,png,gif类型之一！"
    })
    state.loading=false
  }
};

const handleError = (error, file, files) => {
  ElMessage.error("上传失败");
  state.loading=false
};

const Role=reactive({
  roleName:"",
  roleDesc:""
})

onMounted(()=>{
  getRoleName()
})
const getRoleName = () => {
  axios.get("/sysRole/loadDataList/",{params:{
      roleId:userStore.user.roleId
    }}).then((res)=>{
    Role.roleName=res.data.data.list[0].roleName
    Role.roleDesc=res.data.data.list[0].roleDesc
  })
}




var emailGrep =
    /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;

var passGrep = /^[a-zA-Z0-9_.-=*&^%$#@!+]{6,18}$/;


const button=reactive({
  buttonText: '获取验证码', // 按钮文本
  disabled: false, // 是否禁用按钮
  countDownSeconds: 60 // 倒计时秒数
})
const newButton=reactive({
  buttonText: '获取验证码', // 按钮文本
  disabled: true, // 是否禁用按钮
  countDownSeconds: 60 // 倒计时秒数
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
const newCountDown=()=>{
  // 每秒钟更新倒计时
  if (newButton.countDownSeconds > 0) {
    setTimeout(() => {
      newButton.countDownSeconds--
      newButton.buttonText = `${newButton.countDownSeconds} s`
      newCountDown()
    }, 1000)
  } else {
    // 时间到后解除禁用
    newButton.buttonText = '获取验证码'
    newButton.disabled = false
    newButton.countDownSeconds = 60
  }
}

const usernameFormRef=ref('')

const emailFormRef=ref('')

const NewEmailFormRef=ref('')

const refPassForm=ref('')

const usernameForm=reactive({
  username:userStore.user.username
})


const emailForm=reactive({
  email:""
})

const NewEmailForm=reactive({
  email:"",
  code:""
})
const passForm=reactive({
    oldPassword:'',
    newPassword:''
})


const validateNewPassword = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请填写此字段~'))
  }else {
    if (!passGrep.test(value)){
      return callback(new Error("用户名由2~8位中英文、数字、下划线组成"))
    }else {
        axios.get("/sysUser/selectPass",{params:{
            email:userStore.user.email,
            password:passForm.newPassword
          }}).then((res)=>{
            if (res.data.data!=null) {
              return callback(new Error('新密码和旧密码不能一致！'))
            }else {
              callback()
            }
        })
    }
  }
}

const validateOldPassword = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请填写此字段~'))
  }else {
    if (!passGrep.test(value)){
      return callback(new Error("用户名由2~8位中英文、数字、下划线组成"))
    }else {
      callback()
    }
  }
}



const rulesPassForm=reactive({
  oldPassword:[{validator:validateOldPassword,trigger:'blur'}],
  newPassword:[{validator:validateNewPassword,trigger:'blur'}]
})


const validateUsername = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请填写此字段~'))
  }
  callback()
}


const SwitchEmail=reactive({
  code:true,
})


const usernameRules=reactive({
  username:[{validator:validateUsername,trigger:'blur'}],
})
const validateNewEmail = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请填写您换绑的邮箱~'))
  } else {
    if (!emailGrep.test(value)){
      return callback(new Error("请按照正确的邮箱格式填写"))
    }else {
      newButton.disabled=false
      callback()
    }

  }
}
const validateCode=(rule,value,callback)=>{
  if (!value){
    return callback(new Error('请填写该字段'))
  }else{
    callback()
  }
}

const NewEmailRules=reactive({
  email:[{validator:validateNewEmail,trigger:'blur'}],
  code:[{validator:validateCode,trigger:'blur'}]
})

const validateEmail = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请填写发送至邮箱的验证码~'))
  } else {
    callback()
  }
}


const emailRules=reactive({
  email:[{validator:validateEmail,trigger:'blur'}],
})

const sendEmail=()=>{
  button.disabled=true
  countDown()
  axios.get("/email/verifyOldEmail",{params:{
      email:userStore.user.email
    }}).then(()=>{
      ElMessage.success("邮件已发送，请注意查收")
  })
}

const NewEmailSend=()=>{
  newButton.disabled=true
  newCountDown()
    axios.get("/email/verifyOldEmail",{params:{
      email:NewEmailForm.email
      }
    }).then(()=>{
      ElMessage.success("邮件已发送，请注意查收")
    })
}

const changePass=()=>{
  refPassForm.value.validate((valid)=>{
      if (valid){
        axios.get("/sysUser/updatePass",{params:{
            email:userStore.user.email,
            newPassword:passForm.newPassword,
            oldPassword:passForm.oldPassword
          }}).then((res)=>{
            if (res.data.data>0){
              ElNotification({
                type:"success",
                title:"修改成功",
                message:"密码修改成功,请重新登录"
              })
              const loading = ElLoading.service({
                lock: true,
                text: 'Loading',
                background: 'rgba(0, 0, 0, 0.7)',
              })
              localStorage.clear()
              sessionStorage.clear()
              setTimeout(()=>{
                loading.close()
                router.push("/login")
              },2000)
            }else {
              ElMessage.warning(res.data.data)
            }
        })
      }
  })
}
const changeEmail=()=>{
  NewEmailFormRef.value.validate((valid)=>{
    if (valid){
      axios.get("/sysUser/changeEmail",{params:{
          oldEmail:userStore.user.email,
          newEmail:NewEmailForm.email,
          code:NewEmailForm.code
        }}).then((res)=>{
            if (res.data.code!=500){
              localStorage.clear()
              sessionStorage.clear()
              ElNotification({
                type:"success",
                title:"修改成功",
                message:res.data.data
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
            }else {
              ElMessage.error(res.data.info)
            }
      })
    }
  })
}
const emailSubmit=()=>{
  emailFormRef.value.validate((valid)=>{
    if (valid){
      axios.get("/sysUser/verifyOldEmail",{params:{
          email:userStore.user.email,
          code:emailForm.email
        }}).then((res)=>{
          if (res.data.code!=500){
            const loading = ElLoading.service({
              lock: true,
              text: 'Loading',
              background: 'rgba(0, 0, 0, 0.7)',
            })
            setTimeout(()=>{
              loading.close()
              SwitchEmail.code=false
            },1000)
          }else {
            ElMessage.error(res.data.info)
          }
      })
      }
  })
}

const usernameSubmit=()=> {
  usernameFormRef.value.validate((valid) => {
    if (valid) {
      if (usernameForm.username != userStore.user.username) {
        axios.get("sysUser/updateUserName", {
          params: {
            id: userStore.user.id,
            email: userStore.user.email,
            userName: usernameForm.username
          }
        }).then((res) => {
          if (res.data.code != 500) {
            localStorage.clear()
            sessionStorage.clear()
            const loading = ElLoading.service({
              lock: true,
              text: 'Loading',
              background: 'rgba(0, 0, 0, 0.7)',
            })
            ElNotification({
              type:"success",
              title:"修改成功",
              message:"名称更新成功，请重新登录"
            })
            setTimeout(() => {
              loading.close()
              router.push("/login")
            }, 2000)
          }
        })
      } else {
        ElMessage.success("什么都没有变化哦~~")
      }
    }
  })
}


</script>

<style>

</style>