<!--
 * @Descripttion: 
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-12 14:52:24
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-07-12 15:00:45
-->
<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="基本配置" name="first">基本配置</el-tab-pane>
    <el-tab-pane label="样式配置" name="second">样式配置</el-tab-pane>
    <el-tab-pane label="组件属性" name="third">组件属性</el-tab-pane>
    <el-tab-pane label="其他配置" name="fourth">其他配置</el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const activeName = ref('second')
</script>

<style lang="scss"></style>
