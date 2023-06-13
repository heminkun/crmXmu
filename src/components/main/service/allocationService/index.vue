<template>
  <div class="flex" style="width: 95%;height: 90%;">
    <div class="flex column" style="width: 100%;">
      <div class="flex column" style="background-color: white;position: relative;padding-bottom: 20px;justify-content: center">
        <el-descriptions
            column="3"
            border
            title="服务分配"
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
            <el-input v-model="state.select.svrCustName" style="width: 300px" size="small"> <template #suffix><el-icon @click="getSvrData"><Search /></el-icon></template> </el-input>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                概要
              </div>
            </template>
            <el-input v-model="state.select.svrTitle" size="small"><template #suffix><el-icon @click="getSvrData"><Search /></el-icon></template></el-input>
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
            <el-select @change="getSvrData" v-model="state.select.svrType">
              <el-option
                 v-for="item in state.select.svrTypeList"
                 :value="item.value"
                 :label="item.label"
              >
              </el-option>
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                创建日期
              </div>
            </template>
            <div class="flex" style="justify-content: space-around">
              <div>开始时间：<el-date-picker type="datetime" v-model="state.select.startDate" style="width: 150px;" size="small"></el-date-picker></div>
              <div>结束时间：<el-date-picker type="datetime" v-model="state.select.endDate" style="width: 150px;" size="small"></el-date-picker></div>
              <el-button @click="timeSelect" size="small">查询</el-button>
            </div>
          </el-descriptions-item>
          <el-descriptions-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                每页显示条数
              </div>
            </template>
            <el-select @change="getSvrData" v-model="state.page.pageSize">
              <el-option
              v-for="item in state.select.svrStatusList"
              :label="item.label"
              :value="item.value"
              >
              </el-option>
            </el-select>
          </el-descriptions-item>
        </el-descriptions>
        <el-table v-loading="state.svr.loading" :data="state.svr.svrData">
          <el-table-column prop="svrCustName" label="客户名称"></el-table-column>
          <el-table-column prop="svrTitle" label="概要"></el-table-column>
          <el-table-column prop="svrType" label="服务类型"></el-table-column>
          <el-table-column prop="svrCreateBy" label="创建人"></el-table-column>
          <el-table-column prop="svrCreateDate" label="创建时间"></el-table-column>
          <el-table-column label="服务分配">
            <template #default="{row}">
            <el-select style="width: 100px;" size="small" v-if="row.svrDueId==null" v-model="state.give.giveValue">
              <el-option
              v-for="item in state.give.giveSelect"
              :value="item.userId"
              :label="item.userName"
              >
              </el-option>
            </el-select>
              <el-button @click="giveSave(row)" v-if="row.svrDueId==null" style="margin-left: 5px" size="small" type="primary">分配</el-button>
              <span>{{row.svrDueTo}}</span>
          </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{row}">
              <el-popconfirm
                  confirm-button-text="OK"
                  cancel-button-text="No"
                  title="你确定要删除吗？"
                  @confirm="confirmEvent(row)"
              >
                <template #reference>
                  <el-button size="small" type="danger">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            background
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 30]"
            :page-size="state.page.pageSize"
            :total="state.page.total"
            v-model="state.page.currentPage"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted,reactive,ref} from "vue";
import {Search, User} from "@element-plus/icons-vue";
import axios from "axios";
import {ElMessage} from "element-plus";
import {currentTime} from "@/utils/date"

const timeNow = currentTime


const regex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;


const state=reactive({
  select:{
    svrCustName:"",
    svrTitle:"",
    startDate:"",
    endDate:"",
    svrType:null,
    svrTypeList:[
      {
        value: null,
        label: '所有',
      },
      {
        value: "咨询",
        label: '咨询',
      },
      {
        value: "投诉",
        label: '投诉',
      },
      {
        value: "建议",
        label: '建议',
      }
    ],
    svrStatusList:[
      {
        value: 1,
        label: '1条',
      },
      {
        value: 3,
        label: "3条",
      },
      {
        value: 5,
        label: "5条",
      },
      {
        value: 7,
        label: "7条",
      },
      {
        value: 9,
        label: "9条",
      },
    ]
  },
  page:{
    pageSize:3,
    total:0,
    currentPage:1
  },
  give:{
    giveValue:4,
    giveSelect:[],
  },
  svr:{
    svrData:[],
    loading:true
  }
})
onMounted(()=>{
  getSvrData()
  getGiveData()
})
const getGiveData = () => {
  axios.get("sysUser/loadDataList",{params:{
      userRoleId:3,
    }}).then((res)=>{
    state.give.giveSelect=res.data.data.list
  })
}
const getSvrData = () => {
  state.svr.loading=true
  axios.get("cstService/loadDataList",{params:{
      pageNo:state.page.currentPage,
      pageSize:state.page.pageSize,
      svrType:state.select.svrType,
      svrCustNameFuzzy:state.select.svrCustName,
      svrTitleFuzzy:state.select.svrTitle,
      svrCreateDateStart:state.select.startDate,
      svrCreateDateEnd:state.select.endDate,
      svrStatus:"已创建"
    }}).then((res)=>{
      state.svr.svrData=res.data.data.list
      state.page.total=res.data.data.totalCount
      state.svr.loading=false
  })
}
const handleCurrentChange = (newCurrentPage) => {
  state.page.currentPage=newCurrentPage
  getSvrData()
}
const confirmEvent = (row) => {
  axios.get("cstService/deleteCstServiceBySvrId",{params:{
      svrId:row.svrId
    }}).then((res)=>{
      if (res.data.code!=200){
        ElMessage.error(res.data.info)
      }else {
        ElMessage.success("删除成功")
        getSvrData()
      }
  })
}
const timeSelect = () => {
      getSvrData()
}
const giveSave = (row) => {
  const bean={
    svrId:row.svrId,
    svrDueId:state.give.giveValue,
    svrDueDate:timeNow,
    svrStatus:"已分配"
  }
  axios.post("cstService/updateCstServiceBySvrId2/",bean).then((res)=>{
    if (res.data.code!=200){
      ElMessage.error(res.data.info)
    }else {
      ElMessage.success("分配成功")
      getSvrData()
    }
  })
}
</script>

<style scoped>

</style>