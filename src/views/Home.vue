<template>
  <div class="max flex">
    <div style="width: 200px;" class="baise flex column">
        <Asidess/>
    </div>
    <div  class="flex1 flex column">
      <Headerss/>
      <div class="flex1 flex flexrow center">
          <router-view/>
        </div>
    </div>
  </div>
</template>

<script setup>
import {ref,reactive} from "vue";
import Asidess from "@/components/aside/index.vue"
import Headerss from "@/components/header/index.vue"
</script>

<style lang="scss">
.flexrow{
  flex-direction: row;
}
.center{
  justify-content: center;
  align-items: center;
}
.el-menu-item{
  transition: 0.8s;
}
.max{
  margin: 0;
  height: 100vh;
  background-color: #eee;
}
.flex{
  display: flex;
}
.baise{
  background-color: white;
}
.flex1{
  flex: 1;
}
.column{
  flex-direction: column;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>