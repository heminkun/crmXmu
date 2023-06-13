<template>
  <div class="flex" style="width: 100%;height: 60px;justify-content: center;">
   <AsideHeader/>
  </div>
  <div class="flex1">
  <el-menu
      :default-active="route.path"
      class="el-menu-vertical-mode"
      text-color="#67879b"
      color="white"
      style=" border: 0;"
      active-text-color="#fff"
      unique-opened="true"
      router
  >
    <el-menu-item  index="/home">
      <el-icon><icon-menu /></el-icon>
      <template #title>主页</template>
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <el-icon><location /></el-icon>
        <span>营销管理</span>
      </template>
      <el-menu-item  v-if="useUser.user.roleId==2" index="/sale">销售机会管理</el-menu-item>
      <el-menu-item  index="/develop">客户开发计划</el-menu-item>
    </el-sub-menu>
    <el-sub-menu v-if="useUser.user.roleId==2"  index="3">
      <template #title>
        <el-icon><icon-menu /></el-icon>
        <span>客户管理</span>
      </template>
      <el-menu-item index="/custom">客户信息管理</el-menu-item>
      <el-menu-item index="/wastage">客户流失管理</el-menu-item>
    </el-sub-menu>
    <el-sub-menu v-if="useUser.user.roleId==2||useUser.user.roleId==3" index="4">
      <template #title>
        <el-icon><document /></el-icon>
        <span>服务管理</span>
      </template>
      <el-menu-item v-if="useUser.user.roleId==2"   index="/addService">服务创建</el-menu-item>
      <el-menu-item v-if="useUser.user.roleId==2"   index="/allocation">服务分配</el-menu-item>
      <el-menu-item v-if="useUser.user.roleId==3"   index="/handle">服务处理</el-menu-item>
      <el-menu-item v-if="useUser.user.roleId==3"  index="/feedback">服务反馈</el-menu-item>
      <el-menu-item index="/filing">服务归档</el-menu-item>
    </el-sub-menu>
    <el-sub-menu v-if="useUser.user.roleId==4"  index="5">
      <template #title>
        <el-icon><document /></el-icon>
        <span>统计报表</span>
      </template>
      <el-menu-item  index="/contribute">客户贡献分析</el-menu-item>
      <el-menu-item  index="/constitute">客户构成分析</el-menu-item>
      <el-menu-item index="/serviceType">客户服务分析</el-menu-item>
      <el-menu-item index="/away">客户流失分析</el-menu-item>
    </el-sub-menu>
    <el-sub-menu v-if="useUser.user.roleId==4"   index="6">
      <template #title>
        <el-icon><document /></el-icon>
        <span>基础数据</span>
      </template>
      <el-menu-item index="/dictionary">数据字典管理</el-menu-item>
      <el-menu-item index="/product">查询产品信息</el-menu-item>
      <el-menu-item index="/inventory">查询库存</el-menu-item>
    </el-sub-menu>
    <el-menu-item  index="/banner">
      <el-icon><User /></el-icon>
      <template #title>图片管理</template>
    </el-menu-item>
    <el-menu-item  index="/personal">
      <el-icon><User /></el-icon>
      <template #title>个人设置</template>
    </el-menu-item>
    <el-menu-item  index="/sysSetup">
      <el-icon><User /></el-icon>
      <template #title>系统设置</template>
    </el-menu-item>
  </el-menu>
  </div>
</template>

<script setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting, User,
} from '@element-plus/icons-vue'
import AsideHeader from '@/components/aside/header/index.vue'
import {useRouter,useRoute} from "vue-router";
import {useUserStore} from "@/stores";

const useUser=useUserStore()

const router=useRouter();
const route=useRoute();
</script>

<style lang="scss">
.el-menu-item.is-active {
  background: linear-gradient(to right, #535b9a, #30bcd7);
}
</style>