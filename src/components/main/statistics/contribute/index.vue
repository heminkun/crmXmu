<template>
  <div class="flex" style="width: 95%;height: 90%;">
    <div class="flex column" style="width: 100%;">
      <div class="flex column" style="background-color: white;position: relative;padding-bottom: 20px;justify-content: center">
        <el-descriptions
            border
            :column="2"
            title="客户贡献分析">
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                客户名称
              </div>
            </template>
            <el-input style="width: 300px;" type="text" size="small" v-model="state.select.name">
              <template #suffix>
                <el-icon @click="getData"><Search /></el-icon>
              </template>
            </el-input>
          </el-descriptions-item>
        </el-descriptions>
        <el-table v-loading="state.contribute.loading" :data="state.contribute.data">
          <el-table-column label="序号" prop="id">
          </el-table-column>
          <el-table-column label="客户名称" prop="name">
          </el-table-column>
          <el-table-column label="金额（元）" prop="totalPrice">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import {Search, User} from "@element-plus/icons-vue";
import {reactive,onMounted} from "vue";
import axios from "axios";



const state=reactive({
  contribute:{
    data:[],
    loading:true
  },
  select:{
    name:""
  }
})
onMounted(()=>{
  getData()
})

const getData = () => {
  state.contribute.loading=true
  axios.get("/contribute/loadDataList",{params:{
    name:state.select.name
    }}).then((res)=>{
    state.contribute.data=res.data.data.list
    state.contribute.loading=false
  })
}
</script>

<style scoped>

</style>