<!--
 * @Descripttion: 
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-02 16:35:15
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-17 18:25:38
-->
<template>
  <div class="codePanel">
    <el-upload :before-upload="beforeUpload">
      <el-button size="small" class="upload-btn" type="primary"
        >选择文件</el-button
      >
    </el-upload>
    <el-input v-model="code" type="textarea" class="code-textarea"> </el-input>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { fileToJson } from '@/utils'
import { ElUpload, ElInput } from 'element-plus'
const code = ref('')
const props = defineProps({
  onChange: Function
})

watch(code, () => {
  props.onChange?.(code.value)
})

async function beforeUpload(file: File) {
  const value = await fileToJson(file)
  console.log(value)
  code.value = JSON.stringify(value, null, 2)
  return false
}
</script>
<style lang="scss" scoped>
.upload-btn {
  margin-bottom: 15px;
}
</style>
