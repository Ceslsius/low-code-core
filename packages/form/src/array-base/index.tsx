/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-19 17:11:42
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-04 11:28:34
 */

import { InjectionKey } from 'vue'
import { provide, defineComponent, Ref, toRefs } from 'vue'
import { uid } from '@formily/shared'

export interface IArrayBaseItemProps {
  index: number
}
const ItemSymbol: InjectionKey<{
  index: Ref<number>
}> = Symbol('ItemContext')
export const ArrayBaseItem = defineComponent({
  name: 'ArrayBaseItem',
  props: ['index'],
  setup(props: IArrayBaseItemProps, { slots }) {
    provide(ItemSymbol, toRefs(props))
    return () => {
      return slots?.default?.()
    }
  },
})
export const useKey = () => {
  const keyMap = new WeakMap()

  return (record: any) => {
    record =
      record === null || typeof record !== 'object' ? Object(record) : record
    if (!keyMap.has(record)) {
      keyMap.set(record, uid())
    }
    return keyMap.get(record)
  }
}

export const Wrapper = defineComponent({
  setup(_props, { slots }) {
    return () => {
      return slots?.default?.()
    }
  },
})
