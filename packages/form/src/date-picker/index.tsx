/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-12 15:27:46
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-12 15:48:44
 */
import { connect, mapProps } from '@formily/vue'
import { ElDatePicker } from 'element-plus'
import { connectElement } from '@/__builtins__'

export const DatePicker = connect(
  connectElement(ElDatePicker),
  mapProps({
    readOnly: 'readonly',
  })
)

export const DateRangePicker = connect(
  DatePicker,
  mapProps((props) => {
    return {
      ...props,
      type: 'daterange',
    }
  })
)

export const DateTimePicker = connect(
  DatePicker,
  mapProps((props) => {
    return {
      ...props,
      type: 'datetime',
    }
  })
)

export const DateTimeRangePicker = connect(
  DatePicker,
  mapProps((props) => {
    return {
      ...props,
      type: 'datetimerange',
    }
  })
)
