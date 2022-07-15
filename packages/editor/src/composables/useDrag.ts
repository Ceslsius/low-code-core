/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-06 17:07:47
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-17 10:58:15
 */

import { inject, provide, readonly, ref } from 'vue'
import { INJECT_isDrag, INJECT_setIsDrag } from '../provide'

export function useDrag() {
  const isDrag = inject(INJECT_isDrag)
  const setIsDrag = inject(INJECT_setIsDrag)
  return {
    isDrag,
    setIsDrag,
  }
}

export function provideDrag() {
  const isDrag = ref(false)
  function setIsDrag(value: boolean) {
    isDrag.value = value
  }
  provide(INJECT_isDrag, readonly(isDrag))
  provide(INJECT_setIsDrag, setIsDrag)
  return { isDrag, setIsDrag }
}
