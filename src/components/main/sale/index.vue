<template>
  <div class="flex" style="width: 95%;height: 90%;">
    <div class="flex column" style="width: 100%;">
      <div class="flex" style="background-color: white;position: relative;padding-bottom: 20px">
      <h2 style="margin-top: 5px;margin-left: 10px">销售机会管理</h2>
        <div style="position: absolute;right: 100px;top: 10px;">
        <el-input placeholder="根据客户名称搜索" v-model="Data.chcCustName" size="small" style="width: 150px;margin-right: 140px">
          <template #suffix><el-icon @click="Select"><Search /></el-icon></template></el-input>
          <el-input placeholder="根据概要搜索" v-model="Data.chcTitle" size="small" style="width: 150px;margin-right: 140px">
            <template #suffix><el-icon @click="Select"><Search /></el-icon></template></el-input>
          <el-input placeholder="根据联系人搜索" v-model="Data.chcLinkman" size="small" style="width: 150px;">
            <template #suffix><el-icon @click="Select"><Search /></el-icon></template></el-input>
        </div>
      </div>
      <div style="background-color: white">
        <div style="justify-content: space-between" class="flex">
          <el-button @click="showAddData" size="small">新增</el-button>
          <el-icon @click="fetchData" style="margin-right: 200px; cursor:pointer;" size="20px" color="#97999A"><Refresh /></el-icon>
        </div>
        <el-dialog width="600" v-model="dialogAdd" title="营销机会添加">
          <el-form :rules="addFormRules" ref="addFormRef" class="flex column" :model="addDataForm">
            <div class="flex" style="justify-content: space-between">
              <el-form-item prop="chcCustName" label="客户名称:">
                <el-input class="inputs" type="text" v-model="addDataForm.chcCustName"></el-input>
              </el-form-item>
              <el-form-item prop="chcSource" label="机会来源:">
                <el-input class="inputs" type="text" v-model="addDataForm.chcSource">
                </el-input>
              </el-form-item>
            </div>
            <div class="flex" style="justify-content: space-between">
              <el-form-item prop="chcRate" label="成功几率:">
                <el-input class="inputs" type="number" :max="100" :min="0" v-model="addDataForm.chcRate">
                </el-input>
              </el-form-item>
              <el-form-item prop="chcLinkman" label="联系人:">
                <el-input class="inputs" type="text" v-model="addDataForm.chcLinkman">
                </el-input>
              </el-form-item>
            </div>
            <div class="flex" style="justify-content: space-between">
              <el-form-item prop="chcTel" label="联系电话:">
                <el-input class="inputs" type="text" v-model="addDataForm.chcTel">
                </el-input>
              </el-form-item>
              <el-form-item prop="chcTitle"  label="概要:">
                <el-input class="inputs" type="text" v-model="addDataForm.chcTitle">
                </el-input>
              </el-form-item>
            </div>
            <div class="flex">
              <el-form-item prop="chcDesc" label="机会描述:">
                <el-input class="inputs" type="textarea" v-model="addDataForm.chcDesc">
                </el-input>
              </el-form-item>
            </div>
            <div class="flex" style="justify-content: space-between">
              <el-form-item prop="chcCreateBy" label="创 建 人:">
                <el-input disabled  class="inputs" type="text" v-model="addDataForm.chcCreateBy">
                </el-input>
              </el-form-item>
              <el-form-item prop="chcCreateDate" label="创建时间:">
                <el-input disabled class="inputs" v-model="addDataForm.chcCreateDate"></el-input>
              </el-form-item>
            </div>
            <div class="flex" style="justify-content: space-around">
              <el-form-item>
                <el-button @click="add">提交</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-dialog>
      </div>
      <div class="no-hover-highlight">
  <el-table  size="large" :highlight-current-row="false" v-loading="isLoading"  :data="Data.list" style="width: 100%;height: 300px">
<!--    <el-table-column v-if="false" prop="chcId" label="编号" width="180" />-->
    <el-table-column prop="chcCustName" label="客户名称" width="180" />
    <el-table-column prop="chcTitle" label="概要" width="180"  />
    <el-table-column prop="chcLinkman" label="联系人" />
    <el-table-column prop="chcTel" label="联系电话" />
    <el-table-column prop="chcCreateDate" label="创建时间" />
    <el-table-column label="操作"><template #default="{row}">
      <el-button style="margin-right: 0px" @click="showAssign(row)" size="small" type="success">
      派指
      </el-button>
      <el-button type="primary" size="small" @click="showDetail(row)">编辑</el-button>
      <el-popconfirm
          confirm-button-text="Yes"
          cancel-button-text="No"
          icon-color="#626AEF"
          title="您确定要删除吗"
          @confirm="deleteData(row)"
      >
        <template #reference>
          <el-button type="danger" size="small">删除</el-button>
        </template>
      </el-popconfirm>
    </template>
    </el-table-column>
  </el-table>
      </div>
      <div>
        <el-pagination
            background
            @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30]"
          :page-size="Data.pageSize"
          :total="Data.total"
          v-model="Data.currentPage">
      </el-pagination>
      </div>
    </div>



    <el-dialog width="600" v-model="dialogFormVisible" title="营销机会编辑">
      <el-form :rules="formRules" ref="formRef" class="flex column" :model="form">
        <div class="flex" style="justify-content: space-between">
          <el-form-item prop="chcCustName" label="客户名称:">
            <el-input class="inputs" type="text" v-model="form.chcCustName"></el-input>
          </el-form-item>
          <el-form-item prop="chcSource" label="机会来源:">
            <el-input class="inputs" type="text" v-model="form.chcSource">
            </el-input>
          </el-form-item>
        </div>
        <div class="flex" style="justify-content: space-between">
          <el-form-item prop="chcRate" label="成功几率:">
            <el-input class="inputs" type="number" :max="100" :min="0"  v-model="form.chcRate">
            </el-input>
          </el-form-item>
          <el-form-item prop="chcLinkman" label="联系人:">
            <el-input class="inputs" type="text" v-model="form.chcLinkman">
            </el-input>
          </el-form-item>
        </div>
        <div class="flex" style="justify-content: space-between">
          <el-form-item prop="chcTel" label="联系电话:">
            <el-input class="inputs" type="text" v-model="form.chcTel">
            </el-input>
          </el-form-item>
          <el-form-item prop="chcTitle"  label="概要:">
            <el-input class="inputs" type="text" v-model="form.chcTitle">
            </el-input>
          </el-form-item>
        </div>
        <div class="flex">
          <el-form-item prop="chcDesc" label="机会描述:">
            <el-input class="inputs" type="textarea" v-model="form.chcDesc">
            </el-input>
          </el-form-item>
        </div>
        <div class="flex" style="justify-content: space-between">
          <el-form-item prop="chcCreateBy" label="创 建 人:">
            <el-input disabled  class="inputs" type="text" v-model="form.chcCreateBy">
            </el-input>
          </el-form-item>
          <el-form-item prop="chcCreateDate" label="创建时间:">
            <el-input disabled class="inputs" v-model="form.chcCreateDate"></el-input>
          </el-form-item>
        </div>
        <div class="flex" style="justify-content: space-around">
          <el-form-item>
            <el-button @click="update">提交</el-button>
          </el-form-item>
          <el-form-item>
            <el-button  plain>清空</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>


    <el-dialog width="800" v-model="dialogAssign">
      <div class="flex column">
        <el-descriptions
            column="2"
            border
            title="销售机会添加"
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
            {{Assign.chcCustName}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                机会来源
              </div>
            </template>
            {{Assign.chcSource}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                成功几率
              </div>
            </template>
            {{Assign.chcRate}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                联系人
              </div>
            </template>
            {{Assign.chcLinkman}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                联系电话
              </div>
            </template>
            {{Assign.chcTel}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                机会描述
              </div>
            </template>
            {{Assign.chcDesc}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                创建人
              </div>
            </template>
            {{Assign.chcCreateBy}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                创建时间
              </div>
            </template>
            {{Assign.chcCreateDate}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                指派人
              </div>
            </template>
            <el-select @change="dsad" v-model="val.AssignVals" class="m-2" placeholder="请选择指派" size="small">
              <el-option
                  v-for="item in Assign.chcDue"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"
              />
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                指派时间
              </div>
            </template>
            {{Assign.chcDueDate}}
          </el-descriptions-item>
        </el-descriptions>
        <div class="flex marginBottom20">
          <el-button style="margin-top: 10px" @click="AssignSubmit">提交</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>

import {Refresh, Search, User} from "@element-plus/icons-vue";
import axios from "axios";
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import {useUserStore} from "@/stores";
import {currentTime} from "@/utils/date"
const dsad = (value) => {
  const selectedOption = Assign.chcDue.find(option=>option.userId === value)
  val.AssignVal=selectedOption
  console.info(val.AssignVal)
}


const val=reactive({
  AssignVals:4,
  AssignVal:{

  }
})

const phone=/^1(3\d|4[5-9]|5[0-35-9]|6[56]|7[0135678]|8\d|9[89])\d{8}$/

const AssignSubmit =()=>{
  if (val.AssignVal.userId!=null||val.AssignVal.userId!=undefined){
  const pojo={
    chcId:Assign.chcId,
    chcDueId:val.AssignVal.userId,
    chcDueTo:val.AssignVal.userName,
    chcDueDate:Assign.chcDueDate,
    chcStatus:2
    }
  axios.post("salChance/updateAssignByChcId", pojo).then((res)=>{
    if (res.data.code!=500){
      ElMessage.success("指派成功！")
      dialogAssign.value=false
      fetchData()
    }
  })
  }else {
    ElMessage.warning("请选择指派人！")
  }
}


const useUser=useUserStore();

const dialogFormVisible = ref(false)
const dialogAdd=ref(false)
const dialogAssign=ref(false)

const formRef=ref('')
const addFormRef=ref('')

const showAssign=(row)=>{
  Assign.chcId=row.chcId
  Assign.chcCustName=row.chcCustName
  Assign.chcSource=row.chcSource
  Assign.chcRate=row.chcRate
  Assign.chcLinkman=row.chcLinkman
  Assign.chcTel=row.chcTel
  Assign.chcTitle=row.chcTitle
  Assign.chcDesc=row.chcDesc
  Assign.chcCreateBy=row.chcCreateBy
  Assign.chcCreateDate=row.chcCreateDate
  Assign.chcCreateId=row.chcCreateId
  // Assign.chcDueId=row.chcDueId
  // Assign.chcDueTo=row.chcDueTo
  Assign.chcDueDate=currentTime
  dialogAssign.value=true
  axios.get("/sysUser/loadDataList",{params:{
    userRoleId:3
    }}).then((res)=>{
      Assign.chcDue=res.data.data.list
  })
}
const showAddData=()=>{
  addDataForm.chcCreateBy=useUser.user.username
  addDataForm.chcCreateDate=currentTime
  addDataForm.chcCreateId=useUser.user.id
  dialogAdd.value=true
}
const confirmEvent = () => {
    deleteData()
}
const deleteData=(row)=>{
  if (row.chcCreateId==useUser.user.id){
  axios.get("/salChance/deleteSalChanceByChcId",{params:{
      chcId:row.chcId
    }}).then((res)=>{
      ElMessage.success("删除成功！")
    fetchData()
  })
  }else {
    ElMessage.warning("您不是创建人，没有权限删除")
  }
}
const validateTel=(rule,value,callback)=>{
  if (!value){
    return callback(new Error("请填写此字段~"))
  }else{
    if (!phone.test(value)){
      callback(new Error("手机号码不符合规范！"))
    }else{
      callback()
    }
  }
}
const validateRate=(rule,value,callback)=>{
  if (!value){
    return callback(new Error("请填写此字段~"))
  }else{
    if (value>100||value<0){
      callback(new Error("必须是0-100的数字"))
    }else{
      callback()
    }
  }
}


const formRules=reactive({
  chcCustName: [{ required: true, message: '请填写此字段~', trigger: 'blur' }],
  chcSource: [{ required: true, message: '请填写此字段~', trigger: 'blur' }],
  chcRate: [{ required: true,validator:validateRate, trigger: 'blur' }],
  chcLinkman: [{ required: true, message: '请填写此字段~', trigger: 'blur' }],
  chcTel: [{required: true,validator:validateTel,trigger: 'blur' }],
  chcTitle: [{ required: true, message: '请填写此字段~', trigger: 'blur' }],
  chcDesc: [{ required: true, message: '请填写此字段~', trigger: 'blur' }],
  chcCreateBy: [{ required: true, message: '请填写此字段~', trigger: 'blur' }],
  chcCreateDate: [{ required: true, message: '请填写此字段~', trigger: 'blur' }],
})


const addFormRules=reactive({
  chcCustName: [{ required: true, message: '请填写此字段~', trigger: 'blur' }],
  chcSource: [{ required: true, message: '请填写此字段~', trigger: 'blur' }],
  chcRate: [{ required: true,validator:validateRate, trigger: 'blur' }],
  chcLinkman: [{ required: true, message: '请填写此字段~', trigger: 'blur' }],
  chcTel: [{ required: true,validator:validateTel, trigger: 'blur' }],
  chcTitle: [{ required: true, message: '请填写此字段~', trigger: 'blur' }],
  chcDesc: [{ required: true, message: '请填写此字段~', trigger: 'blur' }],
  chcCreateBy: [{ required: true, message: '请填写此字段~', trigger: 'blur' }],
  chcCreateDate: [{ required: true, message: '请填写此字段~', trigger: 'blur' }],
})
const showDetail = (row) => {
  dialogFormVisible.value=true
  form.chcId=row.chcId
  form.chcCustName=row.chcCustName
  form.chcSource=row.chcSource
  form.chcRate=row.chcRate
  form.chcLinkman=row.chcLinkman
  form.chcTel=row.chcTel
  form.chcTitle=row.chcTitle
  form.chcDesc=row.chcDesc
  form.chcCreateBy=row.chcCreateBy
  form.chcCreateDate=row.chcCreateDate
  form.chcCreateId=row.chcCreateId
};


const addDataForm=reactive({
  chcId:'',
  chcCustName:"",
  chcSource:"",
  chcRate:'',
  chcLinkman:'',
  chcTel:'',
  chcTitle:'',
  chcDesc:'',
  chcCreateBy:'',
  chcCreateDate:'',
  chcCreateId:''
})

const form=reactive({
  chcId:'',
  chcCustName:"",
  chcSource:"",
  chcRate:'',
  chcLinkman:'',
  chcTel:'',
  chcTitle:'',
  chcDesc:'',
  chcCreateBy:'',
  chcCreateDate:'',
  chcCreateId:''
})



const Assign=reactive({
  chcId:'',
  chcCustName:"",
  chcSource:"",
  chcRate:'',
  chcLinkman:'',
  chcTel:'',
  chcTitle:'',
  chcDesc:'',
  chcCreateBy:'',
  chcCreateDate:'',
  chcCreateId:'',
  chcDueId:'',
  chcDueTo:'',
  chcDueDate:'',
  chcDue:[]
})

const Data=reactive({
  list:[],
  total:0,
  pageSize:5,
  currentPage:1,
  chcCustName:null,
  chcTitle:null,
  chcLinkman:null
})


const Select=()=>{
  fetchData()
}

const isLoading=ref(true)


const fetchData=()=>{
  isLoading.value=true
  axios.get("/salChance/loadDataList",{params:{
      pageSize:Data.pageSize,
      pageNo:Data.currentPage,
      chcCustName:Data.chcCustName,
      chcStatus:1,
      chcTitle:Data.chcTitle,
      chcLinkman:Data.chcLinkman
    }}).then((res)=>{
    Data.list=res.data.data.list
    Data.total=res.data.data.totalCount
    isLoading.value=false
  })
}
fetchData();
const handleSizeChange=(size)=>{
  Data.pageSize = size;
  fetchData();
}
const handleCurrentChange=(newPage)=>{
  Data.currentPage = newPage;
  fetchData()
}


const update=()=>{
  formRef.value.validate((valid)=>{
    const pojo={
      chcId:form.chcId,
      chcCustName:form.chcCustName,
      chcSource:form.chcSource,
      chcRate:form.chcRate,
      chcLinkman:form.chcLinkman,
      chcTel:form.chcTel,
      chcTitle:form.chcTitle,
      chcDesc:form.chcDesc,
      chcCreateBy:form.chcCreateBy,
      chcCreateDate:form.chcCreateDate
    }
    if (valid){
     axios.post("salChance/updateSalChanceByChcId",pojo)
         .then((res)=>{
         if (res.data.code!=500){
           ElMessage.success("修改成功")
           fetchData()
           dialogFormVisible.value=false
         }else {

         }
     })
    }
  })
}
const add=()=>{
  addFormRef.value.validate((valid)=>{
    const bean={
      chcCustName:addDataForm.chcCustName,
      chcSource:addDataForm.chcSource,
      chcRate:addDataForm.chcRate,
      chcLinkman:addDataForm.chcLinkman,
      chcTel:addDataForm.chcTel,
      chcTitle:addDataForm.chcTitle,
      chcDesc:addDataForm.chcDesc,
      chcCreateBy:addDataForm.chcCreateBy,
      chcCreateDate:addDataForm.chcCreateDate,
      chcCreateId:addDataForm.chcCreateId
    }
    if (valid){
      axios.post("/salChance/add",bean).then((res)=>{
        if (res.data.code!=500){
          ElMessage.success("添加成功！")
          dialogAdd.value=false
          fetchData()
          addFormRef.value.resetFields()
        }
      })
    }
  })
}
</script>

<style>
.marginBottom20{
  margin-bottom: 30px;
}

.inputs{
  width: 200px;

}

.no-hover-highlight tbody tr:hover>td {
  background: white!important
}
</style>