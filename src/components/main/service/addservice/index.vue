<template>
  <div class="flex" style="width: 95%;height: 90%;">
  <div class="flex column" style="width: 100%;">
    <div class="flex" style="background-color: white;position: relative;padding-bottom: 20px;justify-content: center">
      <el-descriptions
          column="2"
          border
          title="创建服务"
      >
        <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <user />
            </el-icon>
            客户名称
          </div>
        </template>
          <el-input v-model="state.Add.svrCustName" size="small"></el-input>
      </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              服务类型
            </div>
          </template>
          <el-select size="default" v-model="state.Add.svrType">
            <el-option
            v-for="item in state.Add.svrTypeData"
            :label="item.label"
            :value="item.value"
            ></el-option>
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              服务概要
            </div>
          </template>
          <el-input v-model="state.Add.svrTitle" size="small"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              详细信息
            </div>
          </template>
          <el-input v-model="state.Add.svrRequest" type="textarea" style="width: 300px;" size="small"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
        </el-descriptions-item>
        <el-descriptions-item>
        <el-button @click="save" size="small">保存</el-button>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
  </div>
</template>

<script setup>
import {Search, User} from "@element-plus/icons-vue";
import {ref,reactive} from "vue";
import {useUserStore} from "@/stores";
import {currentTime} from "@/utils/date"
import {ElMessage} from "element-plus";
import axios from "axios";

let timeNow=currentTime;
const useUser=useUserStore()
const state=reactive({
  Add:{
    svrCustName:"",
    svrTitle:"",
    svrRequest:"",
    svrType:"咨询",
    svrTypeData:[
      {
        value: '咨询',
        label: '咨询',
      },
      {
        value: '投诉',
        label: '投诉',
      },
      {
        value: '建议',
        label: '建议',
      },
    ]
  }
})
const save = () => {
  if (state.Add.svrRequest!=null&&state.Add.svrRequest!=""&&state.Add.svrTitle!=null&&state.Add.svrRequest!=""&&state.Add.svrCustName!=""&&state.Add.svrCustName!=null){
    const bean={
      svrType:state.Add.svrType,
      svrTitle:state.Add.svrTitle,
      svrCustName:state.Add.svrCustName,
      svrRequest:state.Add.svrRequest,
      svrCreateId:useUser.user.id,
      svrCreateBy:useUser.user.username,
      svrCreateDate:timeNow,
    }
    axios.post("/cstService/add",bean).then((res)=>{
      if (res.data.code!=200){
        ElMessage.error(res.data.info)
      }else {
        ElMessage.success("服务创建成功")
      }
    })
  }else {
    ElMessage.warning("请填写完整")
  }
}
</script>

<style scoped>

</style>