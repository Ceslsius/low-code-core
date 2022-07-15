/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-12 18:11:12
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2022-07-15 16:27:33
 */

import { inject } from 'vue'
import { Tree } from '../provide'

export function useTree() {
  const tree = inject('editor.tree') as Tree
  return tree
}
