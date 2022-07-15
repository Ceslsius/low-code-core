<!--
 * @Descripttion: 
 * @Author: Zhang Yunzhong
 * @Date: 2021-06-24 17:26:33
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-09-02 12:17:42
-->
<template>
  <div class="editor">
    <Header></Header>
    <div class="tak-editor">
      <div class="left">
        <el-tabs type="border-card" tab-position="left" class="tablist">
          <el-tab-pane label="组件列表">
            <List></List>
          </el-tab-pane>
          <el-tab-pane label="组件树">
            <Tree></Tree>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="center">
        <div class="radio-box">
          <el-radio-group v-model="radio">
            <el-radio :label="1">编辑模式</el-radio>
            <el-radio :label="0">预览模式</el-radio>
          </el-radio-group>
        </div>
        <div ref="parentNodeRef" class="tak-editor-wrapper">
          <div class="iframe-wrapper">
            <iframe id="H5Render" :src="config.url"> </iframe>
            <div
              v-show="isDrag"
              class="iframe-mask"
              @drop="drop"
              @dragover="dragover"
            ></div>
          </div>
        </div>
      </div>

      <div class="right">
        <el-tabs
          v-model="activeName"
          type="border-card"
          tab-position="top"
          class="tablist"
        >
          <el-tab-pane
            v-if="formMode !== 'root'"
            class="form-wrapper"
            :label="formMode === 'page' ? '页面配置' : '基本配置'"
            name="BaseForm"
            lazy
          >
            <BaseForm></BaseForm>
          </el-tab-pane>
          <el-tab-pane
            v-if="formSchema?.props"
            class="form-wrapper"
            label="组件属性"
            name="PropsForm"
            lazy
          >
            <PropsForm></PropsForm>
          </el-tab-pane>
          <el-tab-pane
            v-if="formSchema?.style"
            class="form-wrapper"
            label="样式属性"
            name="StyleForm"
            lazy
          >
            <StyleForm></StyleForm>
          </el-tab-pane>
          <el-tab-pane
            v-if="formSchema?.config"
            class="form-wrapper"
            :label="formSchema?.config?.title || '其他配置'"
            name="ConfigForm"
            lazy
          >
            <ConfigForm></ConfigForm>
          </el-tab-pane>
          <el-tab-pane label="项目配置" name="RootForm" class="form-wrapper">
            <RootForm></RootForm>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useDrag } from '../composables'
import {
  List,
  Tree,
  PropsForm,
  StyleForm,
  BaseForm,
  RootForm,
  ConfigForm,
  Header
} from '../components'
import { RenderMode, useTree } from '@koznak/tree'
import type { ComponentTree } from '@koznak/tree'
import { useRootEditor } from '../composables'
import { ElTabPane, ElTabs, ElRadio, ElRadioGroup,  } from 'element-plus'

const { formMode, config } = useRootEditor()
const activeName = ref('RootForm')

const parentNodeRef = ref({} as HTMLDivElement)
function dragover(ev: DragEvent) {
  ev.preventDefault()
}
const { addComponentTree, setMode, formSchema } = useTree()
watch(formSchema, () => {
  if (!formSchema?.value?.style && activeName.value === 'StyleForm') {
    activeName.value = 'BaseForm'
  } else if (!formSchema?.value?.props && activeName.value === 'PropsForm') {
    activeName.value = 'BaseForm'
  }
})
watch(formMode, () => {
  if (formMode.value === 'root') {
    activeName.value = 'RootForm'
  } else {
    activeName.value = 'BaseForm'
  }
})
function drop(ev: DragEvent) {
  ev.preventDefault()
  const data = ev.dataTransfer?.getData('component')
  if (data) {
    try {
      const info = JSON.parse(data) as ComponentTree
      info.id = Date.now().toString()
      addComponentTree(info)
    } catch (error) {
      console.error(error, data)
    }
  }
}



const { isDrag } = useDrag()
parent.cusData = ref()
const radio = ref(0)

watch(radio, () => {
  setMode(radio.value === 0 ? RenderMode.BROWSE : RenderMode.EDIT)
})
watch(radio, () => {
  setMode(radio.value === 0 ? RenderMode.BROWSE : RenderMode.EDIT)
})
</script>

<style lang="scss" scoped>
.editor {
  display: flex;
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  box-sizing: border-box;
  flex-direction: column;
}
.tak-editor {
  width: 100%;
  flex: 1;
  display: flex;
  background: #f6f6f6;
  text-align: initial;
  font-size: initial;
  color: initial;
  font-weight: initial;
  font-style: initial;
}
.left {
  width: 400px;
  min-width: 385px;
}

.center {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 60px);
  overflow-y: scroll;
  min-width: 385px;
}

.tak-editor-wrapper {
  width: 375px;
  height: 664px;
  background: #fff;
  margin: 15px auto;
  word-wrap: break-word;
}

.right {
  width: 600px;
  box-sizing: border-box;
  height: 100%;
  border-left: 1px solid #ddd;
}

.h5-iframe {
  width: 100%;
  height: 100%;
}
.tablist {
  height: 100%;
}

#H5Render {
  width: 375px;
  height: 664px;
  display: block;
  border: none;
  z-index: 1;
  position: relative;
  &::-webkit-scrollbar {
    display: none;
  }
}

.iframe-wrapper {
  display: flex;
  position: relative;
}

.iframe-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.radio-box {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}
.form-wrapper {
  height: 85vh;
  overflow: scroll;
}

:deep(.el-tabs__item) {
  padding: 0 5px;
}
</style>
