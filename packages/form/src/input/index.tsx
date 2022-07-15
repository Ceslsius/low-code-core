/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-10 11:37:17
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-11 14:58:52
 */
import { connect, mapProps } from '@formily/vue'
import { ElInput } from 'element-plus'
import { connectElement } from '@/__builtins__'

export const Input = connect(
  connectElement(ElInput),
  mapProps({
    readOnly: 'readonly',
  })
)

export const Textarea = connect(
  Input,
  mapProps((props) => {
    return {
      ...props,
      type: 'textarea',
    }
  })
)

export const Password = connect(
  Input,
  mapProps((props) => {
    return {
      ...props,
      showPassword: true,
      type: 'password',
    }
  })
)
