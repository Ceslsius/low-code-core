/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-05 15:59:06
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-04 11:39:40
 */

import type { InjectionKey, Ref } from 'vue'

type ReadonlyInjectionKey<T> = InjectionKey<Readonly<T>>

export const INJECT_isDrag: ReadonlyInjectionKey<Ref<boolean>> =
  Symbol('INJECT_isDrag')

export const INJECT_setIsDrag: InjectionKey<(value: boolean) => void> =
  Symbol('INJECT_setIsDrag')
