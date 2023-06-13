<template>
  <div class="flex" style="width: 98%;height: 90%;">
    <div class="flex column" style="width: 100%;">
      <div class="flex column" style=" position: relative;padding-bottom: 20px;justify-content: center">
        <div class="flex" style="padding-bottom: 20px;justify-content: space-around">
          <div style="width: 40%;">
            <div>
              <el-carousel v-loading="state.carousel.loading" height="300px">
                <el-carousel-item v-for="item in data.carouselData" :key="item">
                  <el-image :src="item.path"></el-image>
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
          <div class="flex column" style="width:55%;background-color: white;justify-content: start">
            <div class="flex" style="justify-content: center"><h2>添加轮播可选图</h2></div>
            <div class="">
              <el-upload
                  v-model:file-list="fileList"
                  action="http://43.138.152.69:8080/carousel/addCarousel"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-success="handleSuccess"
                  :multiple="true"
                  name="files"
                  :before-upload="beforeUpload"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>

              <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" />
              </el-dialog>
            </div>
          </div>
        </div>
        <div class="flex" style="justify-content: space-around;width: 100%;">
          <div  style="background-color: white;width: 49%">
            <Echarts class="chart" :option="option"></Echarts>
          </div>
          <div style="background-color: white;width: 49%">
            <Echarts class="chart" :option="option2"></Echarts>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script setup>
import {reactive, onMounted, computed, ref} from 'vue'
import axios from "axios";
import {ElMessage, ElNotification,} from "element-plus";
import {Plus} from "@element-plus/icons-vue";

onMounted(()=>{
  getServiceType()
  getLevelData()
  getSetUpCarousel()
})

const fileList = ref([])


const beforeUpload = (file) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isGIF = file.type === 'image/gif'
  if (!isJPG && !isPNG && !isGIF) {
    ElNotification({
      type:"error",
      title:"上传失败",
      message:"只能上传 JPG/PNG/GIF 格式的文件"
    })
    return false
  }
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElNotification({
      type:"error",
      title:"上传失败",
      message:"上传文件大小不能超过 5MB"
    })
    return false
  }
  return true
}
const handleSuccess = (response,) => {
  if (response.code!=200){
    ElNotification({
      title:"上传失败",
      message:response.info
    })
  }else {
    ElNotification({
      title:"上传成功",
      message:response.data+"。请前往系统设置进行更换"
    })
  }


}

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const getSetUpCarousel = () => {
  axios.get("sysSetup/getSetUpCarousel").then((res)=>{
    data.carouselData=res.data.data
  })
}
const getServiceType = () => {
  axios.get('cstServiceType/getEchartsData').then((res)=>{
    if (res.data.code!=200){
      ElMessage.error(res.data.info)
    }else {
      data.chartServiceTypeData=res.data.data
    }
  })
}
const getLevelData = () => {
  state.carousel.loading=true
  axios.get('cstLevel/getEchartsData').then((res)=>{
    if (res.data.code!=200){
      ElMessage.error(res.data.info)
    }else {
      data.chartLevelData=res.data.data
      state.carousel.loading=false
    }
  })
}
const state=reactive({
  carousel:{
    loading:true
  }
})
const data=reactive({
  chartLevelData:[],
  chartServiceTypeData:[],
  carouselData:[],

})

const option2 = computed(()=>{
  return{
    title: {
      text: '各个服务类型数量',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data.chartServiceTypeData
      }
    ]
  }
})


const option =computed(()=>{
  return{
    title: {
      text: '各个等级客户数量',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '图表',
        type: 'pie',
        radius: '50%',
        data: data.chartLevelData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
})
</script>

<style scoped>
.chart{
  height: 400px;
  width: 750px;
}
.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>

