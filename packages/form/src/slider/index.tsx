/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-11 17:55:24
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-11 18:07:20
 */
import { connect, mapProps } from '@formily/vue'
import { ElSlider } from 'element-plus'
import { connectElement } from '@/__builtins__'

export const Slider = connect(
  connectElement(ElSlider, {
    disableEvents: true,
    watch: true,
  }),
  mapProps({
    readOnly: 'readonly',
  })
)
