<template>
  <div class="flex" style="width: 95%;height: 95%;">
    <div class="flex column" style="width: 100%;">
      <div class="flex column" style="background-color: white;position: relative;padding-bottom: 20px;justify-content: center">
        <el-table v-loading="state.loading" :data="state.data">
          <el-table-column width="100px" label="编号" prop="id"></el-table-column>
          <el-table-column width="400px" label="图片名称" prop="name"></el-table-column>
          <el-table-column label="缩略图"><template #default="{row}">
            <el-image style="width: 150px;height: 80px;" :src="row.path"></el-image>
          </template> </el-table-column>
          <el-table-column width="600px" label="哈希值" prop="hash"></el-table-column>
          <el-table-column label="操作">
            <template #default="{row}">
            <el-button @click="openDialog(row)" type="primary">编辑</el-button>
              <el-popconfirm
                  title="确定要删除吗"
                  @confirm="confirmDelete(row)"
              >
                <template #reference>
                  <el-button type="danger">删除</el-button>
                </template>
              </el-popconfirm>
          </template> </el-table-column>
        </el-table>
        <el-pagination
            background
            :page-size="state.paging.pageSize"
            :total="state.paging.total"
            @current-change="handleCurrentChange"
            v-model="state.paging.currentPage"
        >
        </el-pagination>
      </div>
      <el-dialog width="550" @close="dialogClose" class="flex column" v-model="state.dialog.on_off">
        <div class="flex">
          <el-form-item label="图片名称:">
            <el-input style="width: 400px"  v-model="state.dialog.name">
              <template #suffix><span>{{state.dialog.suffix}}</span> </template>
          </el-input></el-form-item>
        </div>
        <el-button @click="saveName">保存</el-button>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import {onMounted, reactive} from "vue";
import {ElMessage, ElNotification} from "element-plus";

const state=reactive({
  dialog:{
    on_off:false,
    fileName:"",
    suffix:"",
    name:"",
    path:""
  },
  loading:true,
  data:[],
  paging:{
    pageSize:5,
    total:0,
    currentPage:1,
  }
})

const confirmDelete = (row) => {
    axios.get("carousel/deleteByName",{params:{
        id:row.id,
        name:row.name
      }}).then((res)=>{
        if (res.data.code!=200){
          ElNotification({
            type:"error",
            title:"删除失败",
            message:res.data.data
          })
        }else {
          ElMessage.success("删除成功")
          getData()
        }
    })
}
const saveName = () => {
  if (state.dialog.name!=""&&state.dialog.name!=null){
    if (state.dialog.name.length<30){
      axios.get("carousel/updateNameByName",{params:{
          odlName:state.dialog.fileName,
          newName:(state.dialog.name+state.dialog.suffix),
          path:state.dialog.path
        }}).then((res)=>{
        if (res.data.code!=200){
          ElNotification({
            type:"error",
            title:"修改失败",
            message:res.data.info+",可能是文件重名,请检查其他文件名称！"
          })
        }else {
          ElMessage.success("修改文件名称成功")
          state.dialog.on_off=false
          getData()
        }
      })
    }else {
      ElMessage.warning("文件名称不能太长")
    }
  }else {
    ElMessage.warning("请填写文件名称")
  }
}
const openDialog = (row) => {
  let dotIndex =row.name.lastIndexOf(".")
  state.dialog.fileName=row.name
  state.dialog.path=row.path
  state.dialog.suffix=row.name.substring(dotIndex)
  state.dialog.name=row.name.substring(0,dotIndex)
  state.dialog.on_off=true
}
const dialogClose = () => {
  state.dialog.fileName=""
  state.dialog.suffix=""
  state.dialog.name=""
  state.dialog.path=""
}


onMounted(()=>{
  getData()
})
const getData = () => {
  state.loading=true
  axios.get("carousel/loadDataList",{params:{
      pageSize:state.paging.pageSize,
      pageNo:state.paging.currentPage,
    }}).then((res)=>{
    state.data=res.data.data.list
    state.paging.total=res.data.data.totalCount
    state.loading=false
  })
}

const handleCurrentChange = (newCurrentPage) => {
  state.paging.currentPage=newCurrentPage
  getData()
}
</script>

<style scoped>

</style>