/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-11 18:25:50
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-12 15:46:28
 */
import { connect, mapProps } from '@formily/vue'
import { ElTimePicker } from 'element-plus'
import { connectElement } from '@/__builtins__'

export const TimePicker = connect(
  connectElement(ElTimePicker),
  mapProps({
    readOnly: 'readonly',
  })
)

export const TimeRangePicker = connect(
  TimePicker,
  mapProps((props) => {
    return {
      ...props,
      isRange: true,
    }
  })
)
