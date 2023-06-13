<template>
  <el-select
      v-model="value1"
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
</template>

<script setup>

import {reactive, ref,onMounted} from 'vue'
import axios from "axios";

const value1 = ref([])
const state=reactive({
  data:[]
})
onMounted(()=>{
  getSysSetupData()
  getCarouselData()
})
const getCarouselData = () => {
  axios.get("/carousel/loadDataList").then((res)=>{
    state.data=res.data.data.list
  })
}
const getSysSetupData = () => {
  axios.get("/sysSetup/getSetUp").then((res)=>{
    value1.value=res.data.data
  })
}
</script>

<style scoped>

</style>