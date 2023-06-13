<template>
  <div class="flex" style="width: 95%;height: 90%;">
    <div class="flex column" style="width: 100%;">
      <div class="flex column" style="background-color: white;position: relative;padding-bottom: 20px;justify-content: center">
        <h3>库存查询</h3>
        <el-table v-loading="state.contribute.loading" :data="state.contribute.data">
          <el-table-column label="产品名称">
            <template #default="{row}">
              <span v-if="row.stkProdId==21">产品A</span>
              <span v-if="row.stkProdId==22">产品B</span>
              <span v-if="row.stkProdId==23">产品C</span>
              <span v-if="row.stkProdId==24">产品D</span>
              <span v-if="row.stkProdId==25">产品E</span>
            </template>
          </el-table-column>
          <el-table-column label="仓库" prop="stkWarehouse">
          </el-table-column>
          <el-table-column label="货位" prop="stkWare">
          </el-table-column>
          <el-table-column label="件数" prop="stkCount">
          </el-table-column>
          <el-table-column label="备注" prop="stkMemo">
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
})
onMounted(()=>{
  getData()
})

const getData = () => {
  state.contribute.loading=true
  axios.get("/storage/loadDataList",{params:{

    }}).then((res)=>{
    state.contribute.data=res.data.data.list
    state.contribute.loading=false
  })
}
</script>

<style scoped>

</style>