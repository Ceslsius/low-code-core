/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-12 10:03:03
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-12 10:25:33
 */
import { Field } from '@formily/core'
import { action } from '@formily/reactive'

export function useAsyncDataSource(service: (field: Field) => Promise<any>) {
  console.log('useAsyncDataSource')

  return async (field: Field) => {
    field.loading = true
    service(field).then(
      action.bound?.((data) => {
        field.dataSource = data
        field.loading = false
      })
    )
  }
}
