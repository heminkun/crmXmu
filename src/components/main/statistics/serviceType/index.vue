<template>
  <div class="flex" style="width: 95%;height: 90%;">
    <div class="flex column" style="width: 100%;">
      <div class="flex column" style="background-color: white;position: relative;padding-bottom: 20px;justify-content: center">
        <el-descriptions
            border
            :column="2"
            title="客户服务分析">
        </el-descriptions>
        <el-table v-loading="state.contribute.loading" :data="state.contribute.data">
          <el-table-column label="序号" prop="cstId">
          </el-table-column>
          <el-table-column label="条目" prop="cstServiceType">
          </el-table-column>
          <el-table-column label="服务数量" prop="cstAmount">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import {reactive,onMounted} from "vue";
import axios from "axios";



const state=reactive({
  contribute:{
    data:[],
    loading:true
  },

})
onMounted(()=>{
  getData()
})

const getData = () => {
  state.contribute.loading=true
  axios.get("/cstServiceType/loadDataList",).then((res)=>{
    state.contribute.data=res.data.data.list
    state.contribute.loading=false
  })
}
</script>

<style scoped>

</style>