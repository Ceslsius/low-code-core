<!--
 * @Descripttion: 
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-13 18:45:04
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-17 12:30:33
-->
<template>
  <Form @changeData="changeData"></Form>
</template>

<script lang="ts" setup>
import { createCusForm } from '@koznak/form'
import type { ISchema } from '@formily/json-schema'
import { useTree } from '@koznak/tree'
import { computed, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import { useEditorOptions } from '@/composables/useEditorOptions'

const options = useEditorOptions()
const { Form, initForm } = createCusForm(options.formOptions)
const { activityComponentTree, setActivityComponentTree } = useTree()
const schema = computed<ISchema>(() => {
  return {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        title: 'ID',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        readOnly: true
      },
      type: {
        type: 'string',
        title: '属性',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        readOnly: true
      },
      name: {
        type: 'string',
        title: '名称',
        'x-decorator': 'FormItem',
        'x-component': 'Input'
      },
      path: {
        type: 'string',
        title: '访问路径',
        description: '必须/开头',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-visible': activityComponentTree.value?.type === 'page'
      },
      description: {
        type: 'string',
        title: '描述',
        'x-decorator': 'FormItem',
        'x-component': 'Input'
      }
    }
  }
})
watch(
  () => activityComponentTree.value?.id,
  () => {
    if (activityComponentTree.value?.type === 'page') {
      const { name, description, id, type, path } = activityComponentTree.value
      initForm({
        schema: cloneDeep(schema.value),
        values: {
          id,
          name,
          type,
          description,
          path
        }
      })
    } else {
      const { name, description, id, type } = activityComponentTree.value || {}
      initForm({
        schema: cloneDeep(schema.value),
        values: {
          id,
          name,
          type,
          description
        }
      })
    }
  },
  {
    immediate: true
  }
)

function changeData(value: any) {
  setActivityComponentTree(value)
}
</script>

<style lang="scss"></style>
