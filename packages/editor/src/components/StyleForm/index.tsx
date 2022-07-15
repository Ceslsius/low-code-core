/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-14 12:01:55
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-17 14:06:14
 */
import { useEditorOptions } from '@/composables'
import { createCusForm } from '@koznak/form'
import { useTree } from '@koznak/tree'
import { watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import { defineComponent } from 'vue'

export const StyleForm = defineComponent({
  setup() {
    const options = useEditorOptions()
    const { Form, initForm } = createCusForm(options.formOptions)
    const { formSchema, activityComponentTree, setActivityComponentTree } =
      useTree()
    watch(
      () => formSchema.value?.style,
      () => {
        initForm({
          schema: cloneDeep(formSchema.value?.style as any),
          values: cloneDeep(activityComponentTree.value?.style) || {},
        })
      },
      {
        immediate: true,
      }
    )

    function onChangeData(value: any) {
      setActivityComponentTree({
        style: value,
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
