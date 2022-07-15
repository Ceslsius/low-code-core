/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-11 17:35:46
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-11 18:19:38
 */
import { connect, mapProps } from '@formily/vue'
import { ElCascader } from 'element-plus'
import { connectElement } from '@/__builtins__'

export const Cascader = connect(
  connectElement(ElCascader, {
    disableEvents: true,
    watch: true,
    props: {
      readOnly: {},
    },
  }),
  mapProps({
    dataSource: 'options',
  })
)
