<!--
 * @Descripttion: 
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-10 10:08:37
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-25 09:53:48
-->

<template>
  <div id="app" class="form">
    <FormProvider :form="form">
      <SchemaField
        :schema="schema"
        :scope="{ useAsyncDataSource, loadData }"
      ></SchemaField>
      <FormConsumer>
        <template #default="{form}">
          <div style="white-space: pre">
            {{ JSON.stringify(form.values, null, 2) }}
          </div>
        </template>
      </FormConsumer>
    </FormProvider>
  </div>
</template>

<script lang="ts" setup>
import { components, useAsyncDataSource } from '@/index'
import { Field } from '@formily/core'
import {
  FormProvider,
  createSchemaField,
  FormConsumer,
  createForm,
  connect,
  mapProps
} from '@formily/vue'
import { ElFormItem } from 'element-plus'
import { schema } from './schema'

const loadData = async (field: Field) => {
  console.log('loadData', field)
  const select = field.query('select').get('value')
  if (!select) return []
  return new Promise(resolve => {
    setTimeout(() => {
      const arr = [
        {
          label: `${select}的label1`,
          value: `${select}的value1`
        },
        {
          label: `${select}的label2`,
          value: `${select}的value2`
        },
        {
          label: `${select}的label3`,
          value: `${select}的value3`
        }
      ]
      field.setValue(arr[1].value)
      resolve(arr)
    }, 1500)
  })
}
console.log(components)

const { SchemaField } = createSchemaField({
  components: {
    ...components,
    FormItem: connect(
      ElFormItem,
      mapProps({
        title: 'label'
      })
    )
  }
})
const form = createForm()
</script>

<style>
.form {
  width: 800px;
}
</style>
