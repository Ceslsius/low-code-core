<!--
 * @Descripttion: 
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-10 10:08:37
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-09-02 11:31:06
-->

<template>
  <ProvideTree :tree="tree">
    <Editor></Editor>
  </ProvideTree>
</template>

<script lang="ts" setup>
import { createEditor } from '@/index'
import { ElMessage } from 'element-plus'
import { ProvideTree } from '@koznak/tree'
document.domain = window.location.hostname

const { Editor, tree } = createEditor({
  iframeId: 'H5Render',
  type: 'custom',
  config: {
    url: 'http://192.168.20.170:8080/',
    copyUrl: () => {
      ElMessage.success('复制成功')
    }
  },
  save: async () => {
    ElMessage.success('保存成功')
  },
  formOptions: {
    scope: {}
  },
  rootSchema: {}
})
</script>

<style></style>
