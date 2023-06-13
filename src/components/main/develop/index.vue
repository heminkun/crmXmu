<template>
  <div class="flex" style="width: 95%;height: 90%;">
    <div class="flex column" style="width: 100%;">
      <div class="flex" style="background-color: white;position: relative;padding-bottom: 20px">
        <h2 style="margin-top: 5px;margin-left: 10px">客户开发计划</h2>
      </div>
      <div class="flex" style="background-color: white;justify-content: space-around">
      <div>
        <el-select @change="selectChange" v-model="value" class="m-2" placeholder="状态筛选" size="small">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </div>
      <div>
        <el-input v-model="state.select.chcCustName" placeholder="根据客户名称搜索" size="small" style="width: 150px">
          <template #suffix><el-icon @click="select"><Search /></el-icon></template></el-input>
      </div>
        <div>
          <el-input v-model="state.select.chcTitle" placeholder="根据概要搜索" size="small" style="width: 150px">
            <template #suffix><el-icon @click="select"><Search /></el-icon></template></el-input>
        </div>
        <div>
          <el-input v-model="state.select.chcLinkman" placeholder="根据联系人搜索" size="small" style="width: 150px">
            <template #suffix><el-icon @click="select"><Search /></el-icon></template></el-input>
        </div>
        <div>
          <el-icon @click="Searchs" style="margin-right: 200px; cursor:pointer;" size="20px" color="#97999A"><Refresh /></el-icon>
        </div>

      </div>
      <div class="no-hover-highlight">
        <el-table v-loading="loading" :data="state.Data" size="large" style="width: 100%;height: 300px">
          <el-table-column prop="chcCustName" label="客户名称" width="180" />
          <el-table-column prop="chcTitle" label="概要" width="180"  />
          <el-table-column prop="chcLinkman" label="联系人" />
          <el-table-column prop="chcTel" label="联系电话" />
          <el-table-column prop="chcCreateDate" label="创建时间" />
          <el-table-column prop="chcStatus" label="状态" >
            <template #default="{row}">
              <span v-if="row.chcStatus==2">已指派</span>
              <span v-if="row.chcStatus==3">开发成功</span>
              <span v-if="row.chcStatus==4">终止开发</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{row}">
              <div class="flex column" v-if="row.chcStatus==2">
                <div style="padding-bottom: 10px">
              <el-button @click="dialogFormulate(row)" size="small" type="info">
                制定
              </el-button>
                <el-button @click="dialogExecute(row)" size="small" type="warning">
                  执行
                </el-button>
                </div>
                <div class="flex">
                <el-button @click="changeSuccess(row)" size="small" type="success">
                  成功
                </el-button>
                  <el-popconfirm
                  @confirm="changeTermination(row)"
                  cancel-button-text="No"
                  confirm-button-text="Yes"
                  title="确定要终止吗？"
                  >
                    <template #reference>
                      <el-button size="small" type="danger">
                        终止
                      </el-button>
                    </template>
                  </el-popconfirm>
                </div>
              </div>
              <div v-else>
                <el-button  @click="dialogInfo(row)" type="primary" size="small">查看状态</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-pagination
            background
            @current-change="handleCurrentChange"
            :page-size="state.paging.pageSize"
            :total="state.paging.total"
            v-model="state.paging.currentPage"
           >
        </el-pagination>
      </div>
    </div>
    <el-dialog @close="dialogClose" class="flex"  style="justify-content: center"  v-model="state.dialog.formulate.on_off">
          <div class="flex column">
            <el-descriptions
                title="客户信息"
                :column="2"
                border
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
                {{ state.dialog.formulate.data.chcCustName }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon>
                      <iphone />
                    </el-icon>
                    机会来源
                  </div>
                </template>
                {{state.dialog.formulate.data.chcSource}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon>
                      <location />
                    </el-icon>
                    成功几率
                  </div>
                </template>
                {{state.dialog.formulate.data.chcRate}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon>
                      <tickets />
                    </el-icon>
                    联系人
                  </div>
                </template>
                {{state.dialog.formulate.data.chcLinkman}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon>
                      <office-building />
                    </el-icon>
                    概要
                  </div>
                </template>
                {{state.dialog.formulate.data.chcTitle}}
              </el-descriptions-item>
              <el-descriptions-item v-if="state.min==1">

              </el-descriptions-item>
              <el-descriptions-item v-if="state.min==3">
                  <template #label>
                    <div class="cell-item">
                      <el-icon>
                        <office-building />
                      </el-icon>
                      开发状态
                    </div>
                  </template>
                <span v-if="state.dialog.formulate.data.chcStatus==3">开发成功</span>
                  <span v-if="state.dialog.formulate.data.chcStatus==4">开发失败</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon>
                      <office-building />
                    </el-icon>
                    机会描述
                  </div>
                </template>
                {{state.dialog.formulate.data.chcDesc}}
              </el-descriptions-item>
              <el-descriptions-item>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon>
                      <office-building />
                    </el-icon>
                    创建人
                  </div>
                </template>
                {{state.dialog.formulate.data.chcCreateBy}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon>
                      <office-building />
                    </el-icon>
                    创建时间
                  </div>
                </template>
                {{ state.dialog.formulate.data.chcCreateDate }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon>
                      <office-building />
                    </el-icon>
                    指派人
                  </div>
                </template>
                {{state.dialog.formulate.data.chcDueTo}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon>
                      <office-building />
                    </el-icon>
                   指派时间
                  </div>
                </template>
                {{ state.dialog.formulate.data.chcDueDate }}
              </el-descriptions-item>
            </el-descriptions>

            <el-table v-if="state.min==1" :data="state.dialog.formulate.plan">
              <el-table-column label="日期" prop="plaDate">

              </el-table-column>
              <el-table-column width="350px" label="计划" prop="plaTodo">
              <template v-slot="{row}">
               <el-input  size="small" v-model="row.plaTodo"></el-input>
              </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default={row}>
                  <el-button @click="savePlan(row)" size="small" type="primary">保存</el-button>
                  <el-popconfirm
                      @confirm="deletePlan(row)"
                      title="确定要删除吗？"
                      confirm-button-text="Yes"
                      cancel-button-text="No"
                  >
                    <template #reference>
                  <el-button size="small" type="danger">删除</el-button>
                    </template>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
            <el-table v-loading="salLoading"  v-if="state.min==3" :data="state.dialog.formulate.plan">
              <el-table-column  prop="plaDate" label="日期">
              </el-table-column>
              <el-table-column prop="plaTodo" label="计划">
              </el-table-column>
              <el-table-column prop="plaResult" label="执行效果">
              </el-table-column>
            </el-table>
            <el-table v-loading="salLoading"  v-if="state.min==2" :data="state.dialog.formulate.plan">
              <el-table-column  prop="plaDate" label="日期">

              </el-table-column>
              <el-table-column prop="plaTodo" label="计划">

              </el-table-column>
              <el-table-column width="300px" label="执行效果">
                <template v-slot="{row}">
                  <el-input v-model="row.plaResult"></el-input>
                </template>
              </el-table-column>
              <el-table-column width="80" label="操作">
                <template #default="{row}"><el-button size="small" type="success" @click="addResult(row)">保存</el-button></template>
              </el-table-column>
            </el-table>
            <el-descriptions
                title="新增计划"
                :column="2"
                border
                v-if="state.min==1"
            >
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon>
                      <office-building />
                    </el-icon>
                    日期
                  </div>
                </template>
                {{ dateNow }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon>
                      <office-building />
                    </el-icon>
                    计划项
                  </div>
                </template>
                <el-input v-model="state.dialog.formulate.Todo"></el-input>
              </el-descriptions-item>
              <el-descriptions-item>
               <el-button @click="addTodo">添加</el-button>
              </el-descriptions-item>
            </el-descriptions>
          </div>
    </el-dialog>
  </div>
</template>

<script setup>
import axios from "axios";
import {reactive, onMounted, ref} from "vue";
import {Iphone, Location, OfficeBuilding, Refresh, Search, Tickets, User} from "@element-plus/icons-vue";
import {useUserStore} from "@/stores";
import {currentTime} from "@/utils/date"
import {ElMessage} from "element-plus";


const changeSuccess=(row)=>{
  const bean={
    chcId:row.chcId,
    chcStatus:3
  }
  axios.post("/salChance/updateAssignByChcId",bean).then((res)=>{
    if (res.data.code!=500){
      ElMessage.success("开发成功")
      Searchs()
    }else {
      ElMessage.error(res.data.info)
    }
  })
}
const changeTermination=(row)=>{
  const bean={
    chcId:row.chcId,
    chcStatus:4
  }
  axios.post("/salChance/updateAssignByChcId",bean).then((res)=>{
    if (res.data.code!=500){
      ElMessage.success("终止成功")
      Searchs()
    }else {
      ElMessage.error(res.data.info)
    }
  })
}

const addResult = (row) => {
  if (row.plaResult!=undefined&&row.plaResult!=null&&row.plaResult!=''){
    const bean={
      plaId:row.plaId,
      plaResult:row.plaResult
    }
    axios.post("/salPlan/updateSalPlanByPlaId2",bean).then((res)=>{
      if (res.data.code!=500){
        ElMessage.success("保存成功")

      }else {
        ElMessage.error(res.data.info)
      }
    })
  }else {
    ElMessage.warning("请输入执行效果！")
  }
}

const dateNow=ref('')

const useUser=useUserStore()

const salLoading=ref(true)

const loading=ref(true)

const value = ref('')

const min=ref(0)

const dialogExecute= (row) => {
  state.min=2
  state.dialog.formulate.data.chcId=row.chcId
  state.dialog.formulate.data.chcSource=row.chcSource
  state.dialog.formulate.data.chcCustName=row.chcCustName
  state.dialog.formulate.data.chcTitle=row.chcTitle
  state.dialog.formulate.data.chcRate=row.chcRate
  state.dialog.formulate.data.chcLinkman=row.chcLinkman
  state.dialog.formulate.data.chcTel=row.chcTel
  state.dialog.formulate.data.chcDesc=row.chcDesc
  state.dialog.formulate.data.chcCreateId=row.chcCreateId
  state.dialog.formulate.data.chcCreateBy=row.chcCreateBy
  state.dialog.formulate.data.chcCreateDate=row.chcCreateDate
  state.dialog.formulate.data.chcDueId=row.chcDueId
  state.dialog.formulate.data.chcDueTo=row.chcDueTo
  state.dialog.formulate.data.chcDueDate=row.chcDueDate
  state.dialog.formulate.data.chcStatus=row.chcStatus
  dateNow.value=currentTime
  getSalPlanList(row)
  state.dialog.formulate.on_off=true
}

const dialogInfo = (row) => {
  state.min=3
  state.dialog.formulate.data.chcId=row.chcId
  state.dialog.formulate.data.chcSource=row.chcSource
  state.dialog.formulate.data.chcCustName=row.chcCustName
  state.dialog.formulate.data.chcTitle=row.chcTitle
  state.dialog.formulate.data.chcRate=row.chcRate
  state.dialog.formulate.data.chcLinkman=row.chcLinkman
  state.dialog.formulate.data.chcTel=row.chcTel
  state.dialog.formulate.data.chcDesc=row.chcDesc
  state.dialog.formulate.data.chcCreateId=row.chcCreateId
  state.dialog.formulate.data.chcCreateBy=row.chcCreateBy
  state.dialog.formulate.data.chcCreateDate=row.chcCreateDate
  state.dialog.formulate.data.chcDueId=row.chcDueId
  state.dialog.formulate.data.chcDueTo=row.chcDueTo
  state.dialog.formulate.data.chcDueDate=row.chcDueDate
  state.dialog.formulate.data.chcStatus=row.chcStatus
  getSalPlanList(row)
  state.dialog.formulate.on_off=true
}

const deletePlan=(row)=>{
  axios.get('/salPlan/deleteSalPlanByPlaId',{params:{
      plaId:row.plaId
    }}).then((res)=>{
      if (res.data.code!=500){
        ElMessage.success("删除成功")
        axios.get("/salPlan/loadDataList",{
          params:{
            plaChcId:state.dialog.formulate.data.chcId
          }
        }).then((res)=>{
          state.dialog.formulate.plan=res.data.data.list
        })
      }else {
        ElMessage.error(res.data.info)
      }
  })
}
const dialogClose = () => {
  state.dialog.formulate.Todo=''
  state.dialog.formulate.data=[]
  state.dialog.formulate.plan=[]
}
const addTodo = () => {
  if (state.dialog.formulate.Todo!=''){
    const bean={
      plaChcId:state.dialog.formulate.data.chcId,
      plaDate:dateNow.value,
      plaTodo:state.dialog.formulate.Todo
    }
    axios.post("/salPlan/add",bean).then((res)=>{
        if (res.data.status!=500){
          ElMessage.success("添加成功")
          state.dialog.formulate.on_off=false
          Searchs()
        }else {
          ElMessage.error(res.data.statusText)
        }
    })
  }else {
    ElMessage.warning("请填写计划项！")
  }
}
const savePlan=(row)=>{
    const bean={
      plaId:row.plaId,
      plaTodo:row.plaTodo
    }
    axios.post("/salPlan/updateSalPlanByPlaId2",bean
      ).then((res)=>{
          if (res.data.code!=500){
            ElMessage.success("修改成功！")
            state.dialog.formulate.on_off=false
            Searchs()
          }else {
            ElMessage.error(res.data.info)
          }
    })
}

const selectChange=()=>{
  if (value.value!=null){
    fetchData2()
  }else {
    fetchData()
  }
}

const dialogFormulate=(row)=>{
  state.min=1;
  state.dialog.formulate.data.chcId=row.chcId
  state.dialog.formulate.data.chcSource=row.chcSource
  state.dialog.formulate.data.chcCustName=row.chcCustName
  state.dialog.formulate.data.chcTitle=row.chcTitle
  state.dialog.formulate.data.chcRate=row.chcRate
  state.dialog.formulate.data.chcLinkman=row.chcLinkman
  state.dialog.formulate.data.chcTel=row.chcTel
  state.dialog.formulate.data.chcDesc=row.chcDesc
  state.dialog.formulate.data.chcCreateId=row.chcCreateId
  state.dialog.formulate.data.chcCreateBy=row.chcCreateBy
  state.dialog.formulate.data.chcCreateDate=row.chcCreateDate
  state.dialog.formulate.data.chcDueId=row.chcDueId
  state.dialog.formulate.data.chcDueTo=row.chcDueTo
  state.dialog.formulate.data.chcDueDate=row.chcDueDate
  state.dialog.formulate.data.chcStatus=row.chcStatus
  dateNow.value=currentTime
  getSalPlanList(row)
  state.dialog.formulate.on_off=true
}

const getSalPlanList = (row) => {
  salLoading.value=true
  axios.get("/salPlan/loadDataList",{
    params:{
      plaChcId:row.chcId
    }
  }).then((res)=>{
    state.dialog.formulate.plan=res.data.data.list
    salLoading.value=false
  })
}

const options = [
  {
    value: null,
    label: '所有',
  },
  {
    value: 2,
    label: "已指派",
  },
  {
    value: 3,
    label: '开发成功',
  },
  {
    value: 4,
    label: '终止开发',
  },
]


const select=()=>{
  if (value.value!=null&&value.value!=''){
    fetchData2()
  }else {
    fetchData()
  }
}

const Searchs=()=>{
  if (value.value!=null&&value.value!=''){
    fetchData2()
  }else {
    fetchData()
  }
}

const state=reactive({
  min:0,
  Data:[],
  paging:{
    pageSize:3,
    total:0,
    currentPage:1
  },
  select:{
    chcCustName:null,
    chcTitle:null,
    chcLinkman:null
  },
  dialog:{
    execute:{
      no_off:false
    },
    formulate:{
      on_off:false,
      data:{
        chcId:"",
        chcSource:"",
        chcCustName:"",
        chcTitle:"",
        chcRate:"",
        chcLinkman:"",
        chcTel:"",
        chcDesc:"",
        chcCreateId:"",
        chcCreateBy:"",
        chcCreateDate:"",
        chcDueId:"",
        chcDueTo:"",
        chcDueDate:"",
        chcStatus:"",
      },
      plan:[

      ],
      Todo:'',

    }
  }
})
const handleCurrentChange=(newPage)=>{
  state.paging.currentPage = newPage;
  if (value.value!=null&&value.value!=''){
    fetchData2()
  }else {
    fetchData()
  }
}

onMounted(()=>{
  fetchData()
})

const fetchData=()=>{
  loading.value=true
  axios.get("/salChance/loadDataList2",{params:{
      pageSize:state.paging.pageSize,
      pageNo:state.paging.currentPage,
      chcStatus:1,
      chcCustName:state.select.chcCustName,
      chcTitle:state.select.chcTitle,
      chcLinkman:state.select.chcLinkman,
    }}).then((res)=>{
    state.Data=res.data.data.list
    state.paging.total=res.data.data.totalCount
    loading.value=false
  })
}
const fetchData2=()=>{
  loading.value=true
  axios.get("/salChance/loadDataList",{params:{
      pageSize:state.paging.pageSize,
      pageNo:state.paging.currentPage,
      chcStatus:value.value,
      chcCustName:state.select.chcCustName,
      chcTitle:state.select.chcTitle,
      chcLinkman:state.select.chcLinkman,
    }}).then((res)=>{
    state.Data=res.data.data.list
    state.paging.total=res.data.data.totalCount
    loading.value=false
  })
}
</script>

<style scoped>

</style>