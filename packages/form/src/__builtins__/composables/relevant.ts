/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-11 16:07:35
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-27 15:27:58
 */

import { computed, getCurrentInstance, nextTick, ref, watch } from 'vue'
export interface Parse<T extends any = any> {
  to(value: T): T
  from(value: T): T
}

export const emits = ['focus', 'blur', 'change']

export function useFormrRelevant(
  disableEvents = false,
  watchValue = false,
  parse?: Parse
) {
  const { events } = useEventsRelevant(disableEvents)

  return {
    valueRef: watchValue
      ? useWatchValue(undefined, undefined, parse)
      : useCompuedValue(undefined, undefined, parse),
    events,
  }
}

export function useEventsRelevant(disableEvents = false) {
  const ins = getCurrentInstance()

  const events = {}
  if (!disableEvents) {
    Object.assign(events, {
      onFocus: (e: any) => {
        ins?.emit('focus', e)
      },
      onBlur: (e: any) => {
        ins?.emit('blur', e)
      },
    })
  }
  return { events }
}

export function useWatchValue(
  model = false,
  eventName = model ? 'update:modelValue' : 'value',
  parse?: Parse
) {
  const ins = getCurrentInstance()
  const { key, event } = getEventAndKey(model, eventName)
  const valueRef = ref(
    parse?.from ? parse?.from(ins?.props[key]) : ins?.props[key]
  )
  watch(valueRef, async () => {
    await nextTick()
    ins?.emit(event, parse?.to ? parse?.to(valueRef.value) : valueRef.value)
  })
  return valueRef
}

function getEventAndKey(model: boolean, eventName: string) {
  const event = model
    ? eventName.startsWith('update:')
      ? eventName
      : `update:${eventName}`
    : eventName
  const key = model
    ? eventName.startsWith('update:')
      ? eventName.slice(7)
      : eventName
    : 'value'
  return {
    event,
    key,
  }
}

export function useCompuedValue(
  model = false,
  eventName = model ? 'update:modelValue' : 'change',
  parse?: Parse
) {
  const ins = getCurrentInstance()
  const { key, event } = getEventAndKey(model, eventName)
  const valueRef = computed({
    get() {
      return parse?.from ? parse?.from(ins?.props[key]) : ins?.props[key]
    },
    set(value: any) {
      ins?.emit(event, parse?.to ? parse?.to(value) : value)
    },
  })
  return valueRef
}

export function useModelValue(watch = false, modelEvent = 'update:modelValue') {
  return watch
    ? useWatchValue(true, modelEvent)
    : useCompuedValue(true, modelEvent)
}
