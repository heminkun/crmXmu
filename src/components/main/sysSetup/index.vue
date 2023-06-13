<template>
  <div class="flex" style="width: 98%;height: 98%;">
    <div class="flex column" style="width: 100%;">
      <div class="flex column" style="background-color: white;position: relative;padding-bottom: 20px;justify-content: start;height: 800px;">
        <h2>系统设置</h2>
         <div class="flex" style="padding-top: 30px;align-items: center"> <label style="padding-right: 10px">首页轮播图设置:</label>
           <el-select
               v-model="state.selectValue"
               multiple
               placeholder="Select"
               style="width: 600px"
           >
             <el-option
                 style="height: 300px"
                 v-for="item in state.data"
                 :key="item.id"
                 :value="item.id"
             ><el-image style="width: 600px;height: 300px;" :src="item.path"></el-image></el-option>
           </el-select>
           <el-button @click="saveCarousel" style="margin-left: 20px">
             保存
           </el-button>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import {reactive, ref,onMounted} from 'vue'
import axios from "axios";
import {ElMessage, ElNotification} from "element-plus";




const state=reactive({
  data:[],
  selectValue:[]
})
onMounted(()=>{
  getSysSetupData()
  getCarouselData()
})
const getCarouselData = () => {
  axios.get("/carousel/loadDataList",{params:{
    pageSize:1000
    }}).then((res)=>{
    state.data=res.data.data.list
  })
}
const getSysSetupData = () => {
  axios.get("/sysSetup/getSetUp").then((res)=>{
    state.selectValue=res.data.data
  })
}
const saveCarousel = () => {
    if (state.selectValue.length>=2&&state.selectValue.length<=6){
      const list=state.selectValue

      axios.post("sysSetup/updateSetUpCarousel",list).then((res)=>{
          if (res.data.code!=200){
            ElMessage.error(res.data.info)
          }else {
            ElMessage.success("保存成功")
          }
      })
    }else {
      ElNotification({
        title:"保存失败",
        type:"error",
        message:"图片数量必须大于等于2张小于等于6张"
      })
    }
}
</script>

<style scoped>

</style>