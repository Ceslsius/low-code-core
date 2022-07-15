/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-16 12:00:51
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-02 17:48:31
 */
import { inject } from 'vue'
import { Editor } from '../@types/'
export function useRootEditor() {
  const editor = inject('editor.rootEditor') as Editor
  return editor
}
