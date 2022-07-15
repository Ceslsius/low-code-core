/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-01 17:17:47
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-11 14:53:14
 */
import { connect, mapProps } from '@formily/vue'
import { ElInputNumber } from 'element-plus'
import { connectElement } from '@/__builtins__'

export const InputNumber = connect(
  connectElement(ElInputNumber),
  mapProps({
    readOnly: 'readonly',
  })
)
