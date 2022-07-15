/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-08 11:23:56
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-04 11:38:17
 */
export * from './context'
export * from './ProvideRootEditor'

import { readonly, ref } from 'vue'
import type { CreateEditorOptions, Editor, SaveData } from '../@types'
export type FormMode = 'root' | 'page' | 'component'

export function createRootEditor(options: CreateEditorOptions): Editor {
  const formMode = ref<FormMode>('root')

  function setFormMode(type: FormMode) {
    formMode.value = type
  }

  function save(data: SaveData) {
    options.save(data)
  }

  return {
    formMode: readonly(formMode),
    setFormMode,
    save,
    config: options.config,
  }
}
