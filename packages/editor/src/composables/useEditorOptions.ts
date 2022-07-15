/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-17 11:03:59
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-17 11:04:55
 */
import { inject } from 'vue'
import { CreateEditorOptions } from '../@types/'
export function useEditorOptions() {
  const editor = inject('editor.options') as CreateEditorOptions
  return editor
}
