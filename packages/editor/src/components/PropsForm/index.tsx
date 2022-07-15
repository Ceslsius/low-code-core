/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-13 18:45:09
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-19 17:45:39
 */

import { useEditorOptions } from '@/composables'
import { createCusForm } from '@koznak/form'
import { useTree } from '@koznak/tree'
import { watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import { defineComponent } from 'vue'

export const PropsForm = defineComponent({
  setup() {
    const options = useEditorOptions()
    const { Form, initForm } = createCusForm(options.formOptions)
    const { formSchema, activityComponentTree, setActivityComponentTree } =
      useTree()
    watch(
      () => formSchema.value?.props,
      () => {
        initForm({
          schema: cloneDeep(formSchema.value?.props as any),
          values: cloneDeep(activityComponentTree.value?.props) || {},
        })
      },
      {
        immediate: true,
      }
    )

    function onChangeData(value: any) {
      setActivityComponentTree({
        props: value,
        id: formSchema.value?.id,
      })
    }
    return () => (
      <Form
        {...({
          onChangeData,
        } as any)}
      ></Form>
    )
  },
})
