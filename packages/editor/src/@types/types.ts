/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-06 10:57:10
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-17 11:11:38
 */
import { ISchema } from '@formily/vue'
import { CreateTreeOptions, RootTree } from '@koznak/tree'
import { DeepReadonly, PropType, Ref } from 'vue'
import { FormMode } from '../provide'
import { CreateCusFormOptions } from '@koznak/form'

type DefaultFactory<T> = (props: Data) => T | null | undefined
type Data = Record<string, unknown>

export interface CustomPropOptions<T = any, D = T> {
  type?: PropType<T> | true | null
  required?: boolean
  default?: D | DefaultFactory<D> | null | undefined | object
  validator?(value: unknown): boolean
  editor?: ISchema | (() => ISchema)
}

export interface CreateEditorOptions extends CreateTreeOptions {
  config: EditorConfig
  save: (data: SaveData) => void
  formOptions: CreateCusFormOptions
  rootSchema: ISchema
}

export interface SaveData {
  rootTree: RootTree
}

export interface EditorConfig {
  url: string
  copyUrl: () => void
}
export interface Editor {
  formMode: DeepReadonly<Ref<FormMode>>
  setFormMode: (type: FormMode) => void
  save: (data: SaveData) => void
  config: EditorConfig
}
