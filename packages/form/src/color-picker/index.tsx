/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-11 17:06:26
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-11 17:06:44
 */

import { ElColorPicker } from 'element-plus'
import { connect, mapProps } from '@formily/vue'
import { connectElement } from '@/__builtins__'
export const ColorPicker = connect(
  connectElement(ElColorPicker, {
    disableEvents: true,
    props: {
      readOnly: {},
    },
  }),
  mapProps({})
)
