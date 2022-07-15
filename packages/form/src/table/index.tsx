/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-25 09:49:15
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-25 10:05:05
 */

import { ElTable } from 'element-plus'
import { computed, defineComponent } from 'vue'

export const Table = defineComponent({
  setup() {
    const data = computed(() => {
      return [{}]
    })
    return () => {
      return <ElTable data={data.value}></ElTable>
    }
  },
})
