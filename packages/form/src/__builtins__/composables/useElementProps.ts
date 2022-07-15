/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-13 09:46:21
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-13 09:46:32
 */
import { computed, getCurrentInstance } from 'vue'

export function useElementProps(propsArr?: string[]) {
  const ins = getCurrentInstance()
  const props = ins?.props || {}
  return computed(() => {
    const keys = Object.keys(props).filter((item) => {
      return item !== 'value' && item !== 'modelValue'
    })
    const temp = keys
      .filter((item) => {
        return propsArr ? propsArr.includes(item) : true
      })
      .map<Arr2Tuple>((item) => {
        return [item, props[item]]
      })
    return arr2toObj(temp)
  })
}

export function arr2toObj(arr: Arr2Tuple[]) {
  const temp: Record<string, any> = {}
  arr.forEach((item) => {
    if (item[1] !== undefined) {
      temp[item[0]] = item[1]
    }
  })
  return temp
}

export interface Arr2Tuple extends Array<string | any> {
  0: string
  1: any
  length: 2
}
