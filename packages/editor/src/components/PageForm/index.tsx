/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-17 12:29:17
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-17 14:07:04
 */
import { useEditorOptions } from '@/composables'
import { createCusForm } from '@koznak/form'
import { ref, defineComponent } from 'vue'

export const PageForm = defineComponent({
  setup(_, { expose }) {
    const options = useEditorOptions()
    const { Form, initForm } = createCusForm(options.formOptions)
    initForm({
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            title: 'ID',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          type: {
            type: 'string',
            default: 'page',
          },
          name: {
            type: 'string',
            title: '名称',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          path: {
            type: 'string',
            title: '访问路径',
            description: '必须/开头',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          description: {
            type: 'string',
            title: '描述',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          component: {
            type: 'string',
            default: 'BaseLayout',
          },
          hasSlots: {
            type: 'boolean',
            default: true,
          },
        },
      },
      values: '',
    })
    const form = ref({})
    function onChangeData(value: any) {
      form.value = value
    }

    expose({
      form,
    })
    return () => (
      <Form
        {...({
          onChangeData,
        } as any)}
      ></Form>
    )
  },
})
