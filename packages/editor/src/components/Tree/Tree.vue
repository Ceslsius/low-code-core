<!--
 * @Descripttion: 
 * @Author: Zhang Yunzhong
 * @Date: 2021-06-29 14:27:40
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-09-02 11:55:51
-->
<!-- @ts-nocheck -->
<template>
  <div class="tree-wrapper">
    <el-dialog v-model="dialogVisible" title="添加页面" width="60%">
      <PageForm ref="pageForm"></PageForm>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit"> 确 定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-tree
      ref="treeRef"
      draggable
      :accordion="true"
      :data="source"
      :props="defaultProps"
      :indent="6"
      node-key="id"
      :highlight-current="true"
      :default-expand-all="true"
      :expand-on-click-node="false"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      @node-drop="nodeDrop"
      @node-click="nodeClick"
    >
      <template #default="{ node, data }">
        <span
          class="custom-tree-node"
          :class="{
            'flex-between': data.type === 'root'
          }"
        >
          <span>{{ node.label }}</span>
          <el-button
            v-if="data.type !== 'root'"
            type="text"
            circle
            size="mini"
            @click.stop="remove(node, data)"
            >删除</el-button
          >
          <template v-else>
            <el-button type="text" @click.stop="dialogVisible = true"
              >添加页面
            </el-button>
          </template>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue'
import {
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElTree,
  ElButton
} from 'element-plus'
import type { ComponentTree, PageTree, RootTree } from '@koznak/tree'
import { useTree } from '@koznak/tree'
import { useRootEditor } from '@/composables'
import { PageForm } from '../PageForm'
const pageForm = ref()
const treeRef = ref<typeof ElTree>()
const defaultProps = {
  label: 'name',
  disabled: 'disabled'
}
const {
  rootTree,
  setActivityComponent,
  deleteComponentTree,
  activityComponentTree,
  addPage,
  setActivityPageTree,
  move,
  deletePageTree
} = useTree()
const source = computed(() => {
  return [
    {
      ...rootTree.value,
      disabled: true
    }
  ]
})
const { setFormMode } = useRootEditor()

function nodeClick(item: PageTree | ComponentTree | RootTree) {
  setFormMode(item.type)
  if (item.type === 'page') {
    setActivityPageTree(item.path)
  } else if (item.type === 'component') {
    setActivityComponent(item.id)
  }
}

watch(activityComponentTree, async () => {
  treeRef.value?.setCurrentKey(activityComponentTree.value?.id)
  activityComponentTree.value && setFormMode(activityComponentTree.value.type)
})

const cancel = watch(activityComponentTree, async () => {
  await nextTick()
  activityComponentTree.value && setFormMode('root')
  cancel()
})

function remove(_node: any, data: RootTree | PageTree | ComponentTree) {
  if (data.type === 'page') {
    ElMessageBox.confirm(`确定删除页面${data.name}`, '删除组件').then(() => {
      deletePageTree(data.id)
    })
    return
  }
  ElMessageBox.confirm(`确定删除组件${data.name}`, '删除组件').then(() => {
    deleteComponentTree(data.id)
  })
}

const dialogVisible = ref(false)

function submit() {
  const temp = rootTree.value?.children?.find(item => {
    return item.path === pageForm.value.form.path
  })
  if (temp) {
    ElMessage('已经存在相同路径的页面')
    return
  }
  addPage(pageForm.value.form)
  dialogVisible.value = false
}

function allowDrag(node: any) {
  const nodeTree: RootTree | ComponentTree | PageTree = node?.data
  if (!nodeTree) return false
  if (nodeTree.type !== 'component') return false
  return true
}

function allowDrop(
  draggingNode: any,
  dropNode: any,
  type: 'prev' | 'inner' | 'next'
) {
  const nodeTree: ComponentTree = draggingNode?.data
  const targetNodeTree: RootTree | ComponentTree | PageTree = dropNode?.data
  if (type !== 'inner' && targetNodeTree.type !== 'component') {
    return false
  }
  if (type === 'inner') {
    if (targetNodeTree.type === 'root') return false
    if (!targetNodeTree.hasSlots) {
      return false
    }
    if (targetNodeTree.childrenComponents) {
      return targetNodeTree.childrenComponents.includes(nodeTree.component)
    }
    return targetNodeTree.hasSlots
  }
  return true
}

function nodeDrop(beforeNode: any, afterNode: any, innerNode: any) {
  move({
    node: beforeNode?.data,
    targetNode: afterNode?.data,
    type: innerNode
  })
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  width: 100%;
  display: flex;
  align-items: center;
}

.flex-between {
  justify-content: space-between;
}
.tree-wrapper {
  max-height: calc(100vh - 100px);
  overflow-y: scroll;
}
</style>
