/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-11 17:27:49
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-11 17:29:22
 */
import { connect, mapProps } from '@formily/vue'
import { ElSwitch } from 'element-plus'
import { connectElement } from '@/__builtins__'

export const Switch = connect(
  connectElement(ElSwitch, {
    disableEvents: true,
  }),
  mapProps({
    readOnly: 'readonly',
  })
)
