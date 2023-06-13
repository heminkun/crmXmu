<template>
  <div class="flex" style="width: 95%;height: 90%;">
    <div class="flex column" style="width: 100%;">
      <div class="flex column" style="background-color: white;position: relative;padding-bottom: 20px;justify-content: center">
        <el-descriptions
            border
            :column="3"
            title="产品查询">
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                产品名称
              </div>
            </template>
            <el-input style="width: 300px;" type="text" size="small" v-model="state.select.prodName">
              <template #suffix>
                <el-icon @click="getData"><Search /></el-icon>
              </template>
            </el-input>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                型号
              </div>
            </template>
            <el-input style="width: 300px;" type="text" size="small" v-model="state.select.prodType">
              <template #suffix>
                <el-icon @click="getData"><Search /></el-icon>
              </template>
            </el-input>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                批次
              </div>
            </template>
            <el-input style="width: 300px;" type="text" size="small" v-model="state.select.prodBatch">
              <template #suffix>
                <el-icon @click="getData"><Search /></el-icon>
              </template>
            </el-input>
          </el-descriptions-item>
        </el-descriptions>
        <el-table v-loading="state.contribute.loading" :data="state.contribute.data">
          <el-table-column label="产品名称" prop="prodName">
          </el-table-column>
          <el-table-column label="型号" prop="prodType">
          </el-table-column>
          <el-table-column label="等级/批次" prop="prodBatch">
          </el-table-column>
          <el-table-column label="单位" prop="prodUnit">
          </el-table-column>
          <el-table-column label="单价(元)" prop="prodPrice">
          </el-table-column>
          <el-table-column label="备注" prop="prodMemo">
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
    prodName:"",
    prodType:"",
    prodBatch:""
  }
})
onMounted(()=>{
  getData()
})

const getData = () => {
  state.contribute.loading=true
  axios.get("/product/loadDataList",{params:{
      prodName:state.select.prodName,
      prodType:state.select.prodType,
      prodBatch:state.select.prodBatch

    }}).then((res)=>{
    state.contribute.data=res.data.data.list
    state.contribute.loading=false
  })
}
</script>

<style scoped>

</style>