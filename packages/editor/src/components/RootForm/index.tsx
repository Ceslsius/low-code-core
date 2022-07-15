/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-16 12:18:36
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-09-02 11:29:42
 */
// export { default as RootForm } from './RootForm.vue'

import { defineComponent } from 'vue'
import { createCusForm } from '@koznak/form'
import { useTree } from '@koznak/tree'
import { RootTree } from '@koznak/tree'
import { watch } from 'vue'
import { useEditorOptions } from '@/composables'
import { cloneDeep } from 'lodash-es'

export const RootForm = defineComponent({
  setup() {
    const options = useEditorOptions()
    const { Form, initForm } = createCusForm(options.formOptions)
    const { rootTree, setRootTree } = useTree()
    function initRootForm() {
      if (!rootTree.value) return
      const { name, description, id, type, config } = rootTree.value
      initForm({
        schema: cloneDeep(options.rootSchema),
        values: {
          id,
          name,
          type,
          description,
          config,
        },
      })
    }

    watch(
      rootTree,
      () => {
        initRootForm()
      },
      {
        immediate: true,
      }
    )

    function onChangeData(value: Partial<RootTree>) {
      setRootTree(value)
    }

    return () => (
      <Form
        {...({
          onChangeData,
        } as any as any)}
      ></Form>
    )
  },
})
