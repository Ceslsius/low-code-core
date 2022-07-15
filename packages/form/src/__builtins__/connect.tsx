/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-10 17:13:59
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-27 15:14:33
 */

import { defineComponent, Prop } from 'vue'
import { useElementProps, useFormrRelevant, emits, Parse } from './composables'

export type ConnectProp<T = any> = Prop<T>

export interface ConnectElOptions {
  props?: Record<string, ConnectProp>
  disableEvents?: boolean
  watch?: boolean
  events?: string[]
  parse?: Parse
}

export function connectElement(Element: any, options?: ConnectElOptions) {
  const elProps = Element.props || {}
  const props = {
    ...elProps,
    ...options?.props,
    value: {},
    modelValue: {},
  }
  return defineComponent({
    props,
    emits,
    setup(_props, { slots }) {
      const componentProps = useElementProps(Object.keys(elProps))
      const { events, valueRef } = useFormrRelevant(
        options?.disableEvents,
        options?.watch,
        options?.parse
      )
      return () => {
        return (
          <Element
            {...componentProps.value}
            {...events}
            v-model={valueRef.value}
          >
            {slots}
          </Element>
        )
      }
    },
  })
}
