<template>
  <div class="flex" style="width: 95%;height: 90%;">
    <div class="flex column" style="width: 100%;">
      <div class="flex column" style="background-color: white;position: relative;padding-bottom: 20px">
        <el-descriptions
        title="客户流失管理"
        border
        column="3">
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              客户名称
            </div>
          </template>
          <el-input v-model="state.select.lstCustName" size="small">
            <template #suffix><el-icon @click="getLostData"><Search /></el-icon></template>
          </el-input>
        </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                客户经理
              </div>
            </template>
            <el-input v-model="state.select.lstCustManagerName" size="small">
              <template #suffix><el-icon @click="getLostData"><Search /></el-icon></template>
            </el-input>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                状态
              </div>
            </template>
            <el-select @change="getLostData" v-model="state.select.lstSatusValue" size="small">
              <el-option
                  v-for="item in state.select.lstStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              ></el-option>
            </el-select>
          </el-descriptions-item>
        </el-descriptions>
      <el-table height="160" v-loading="state.Lost.loading" :data="state.Lost.Data">
        <el-table-column prop="lstCustNo" label="客户编号"></el-table-column>
        <el-table-column prop="lstCustName" label="客户名称"></el-table-column>
        <el-table-column prop="lstCustManagerName" label="客户经理"></el-table-column>
        <el-table-column prop="lstLastOrderDate" label="最后下单时间"></el-table-column>
        <el-table-column prop="lstLostDate" label="确认流失时间"></el-table-column>
        <el-table-column label="状态">
          <template #default="{row}">
            <span v-if="row.lstStatus==1">警告</span>
            <span v-if="row.lstStatus==2">暂缓流失</span>
            <span v-if="row.lstStatus==3">已经流失</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{row}">
              <el-button @click="suspendOpen(row)" type="warning" v-if="row.lstStatus==1||row.lstStatus==2" size="small">暂缓流失</el-button>

                <el-button @click="suspendOpen2(row)" type="danger" v-if="row.lstStatus==1||row.lstStatus==2" size="small">确认流失</el-button>

            <el-button @click="openView(row)" type="primary" v-if="row.lstStatus==3" size="small">查看</el-button>
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
    <el-dialog v-model="state.Lost.suspend" @close="suspendClose">
      <el-descriptions
          border
          column="2"
      >
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              客户编号
            </div>
          </template>
          {{state.Lost.suspendData.lstCustNo}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              客户经理
            </div>
          </template>
          {{state.Lost.suspendData.lstCustManagerName}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              客户姓名
            </div>
          </template>
          {{state.Lost.suspendData.lstCustName}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              最后下单时间
            </div>
          </template>
          {{state.Lost.suspendData.lstLastOrderDate}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              暂缓措施
            </div>
          </template>
          {{state.Lost.suspendData.lstDelay}}
        </el-descriptions-item>
        <el-descriptions-item>
      </el-descriptions-item>
        <el-descriptions-item v-if="state.Lost.suspendState==1">
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              追加暂缓措施
            </div>
          </template>
          <el-input style="width: 300px" type="textarea" v-model="state.Lost.AddLstDelay" size="small">
          </el-input>
        </el-descriptions-item>
        <el-descriptions-item v-if="state.Lost.suspendState==2">
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              流失原因
            </div>
          </template>
          <el-input style="width: 300px" type="textarea" v-model="state.Lost.lstReason" size="small">
          </el-input>
        </el-descriptions-item>

      </el-descriptions>
      <el-button v-if="state.Lost.suspendState==1" style="margin-top: 10px" @click="AddSuspend">保存</el-button>
      <el-button v-if="state.Lost.suspendState==2" style="margin-top: 10px" @click="dangerConfirm">保存</el-button>
    </el-dialog>
    <el-dialog v-model="state.Lost.view.viewSw">
      <el-descriptions
          border
          column="2"
      >
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              客户编号
            </div>
          </template>
          {{state.Lost.view.viewData.lstCustNo}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              客户姓名
            </div>
          </template>
          {{state.Lost.view.viewData.lstCustName}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              客户经理
            </div>
          </template>
          {{state.Lost.view.viewData.lstCustManagerName}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              最后下单时间
            </div>
          </template>
          {{state.Lost.view.viewData.lstLastOrderDate}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              暂缓措施
            </div>
          </template>
          {{state.Lost.view.viewData.lstDelay}}
        </el-descriptions-item>
        <el-descriptions-item>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              流失原因
            </div>
          </template>
          {{state.Lost.view.viewData.lstReason}}
        </el-descriptions-item>
        <el-descriptions-item>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import {Search, User} from "@element-plus/icons-vue";
import {ref,reactive,onMounted} from "vue";
import axios from "axios";
import {ElMessage} from "element-plus";


const state=reactive({
  Lost:{
    lstReason:"",
    AddLstDelay:"",
    Data:[],
    loading:true,
    suspend:false,
    suspendState:0,
    suspendData:{},
    view:{
      viewData:{},
      viewSw:false
    }
  },
  select:{
    lstCustName:"",
    lstCustManagerName:"",
    lstSatusValue:null,
    lstStatus:[
      {
        value: null,
        label: "所有",
      },
      {
        value: 1,
        label: '警告',
      },
      {
        value: 2,
        label: '暂缓流失',
      },
      {
        value: 3,
        label: '已经流失',
      },
    ]
  },
  page:{
    pageSize:3,
    total:0,
    currentPage:1
  }
})
onMounted(()=>{
  getLostData()
})
const handleCurrentChange = (newCurrent) => {
  state.page.currentPage=newCurrent
  getLostData()
}
const getLostData = () => {
  state.Lost.loading=true
  axios.get("/cstLost/loadDataList",{params:{
      lstCustName:state.select.lstCustName,
      lstCustManagerName:state.select.lstCustManagerName,
      lstStatus:state.select.lstSatusValue,
      pageNo:state.page.currentPage,
      pageSize:state.page.pageSize
    }}).then((res)=>{
    state.page.total=res.data.data.totalCount
    state.Lost.Data=res.data.data.list
    state.Lost.loading=false
  })
}
const dangerConfirm = () => {
  const bean={
    lstId:state.Lost.suspendData.lstId,
    lstReason:state.Lost.lstReason,
    lstStatus:3
  }
  axios.post("cstLost/updateCstLostByLstId2",bean).then((res)=>{
    if (res.data.code!=200){
      ElMessage.error(res.data.info)
    }else {
      ElMessage.success(res.data.info)
      getLostData()
      state.Lost.suspend=false
    }
  })
}
const suspendOpen = (row) => {
  state.Lost.suspendState=1
  state.Lost.suspendData=row
  state.Lost.suspend=true
}

const suspendOpen2 = (row) => {
  state.Lost.suspendState=2
  state.Lost.suspendData=row
  state.Lost.suspend=true
}
const suspendClose = () => {
  state.Lost.suspendData={}
  state.Lost.AddLstDelay=""
}
const AddSuspend = () => {
  const bean={
    lstId:state.Lost.suspendData.lstId,
    lstDelay:state.Lost.AddLstDelay
  }
  axios.post("cstLost/updateCstLostByLstId2",bean).then((res)=>{
    if (res.data.code!=200){
      ElMessage.error(res.data.info)
    }else {
      ElMessage.success(res.data.info)
      state.Lost.suspend=false
      getLostData()
    }
  })
}
const openView = (row) => {
  state.Lost.view.viewData=row
  state.Lost.view.viewSw=true
}

</script>

<style scoped>

</style>