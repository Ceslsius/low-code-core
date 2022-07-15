/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-11 15:01:01
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-13 10:00:13
 */
import { defineComponent } from 'vue'
import { connect, mapProps } from '@formily/vue'
import { ElFormItem } from 'element-plus'

export const FormBaseItem = defineComponent({
  name: 'FormItem',
  props: {},
  setup(_props, { slots }) {
    return () => {
      return <ElFormItem>{slots}</ElFormItem>
    }
  },
})

export const FormItem = connect(ElFormItem, mapProps({ title: 'label' }))
