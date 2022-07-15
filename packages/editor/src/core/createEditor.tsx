/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-05 17:27:20
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-17 11:07:27
 */

import { defineComponent } from 'vue'
import { provideDrag } from '../composables/'
import Index from './index.vue'
import { createRootEditor, ProvideRootEditor } from '../provide'
import { CreateEditorOptions } from '../@types'
import { createRootTree } from '@koznak/tree'

export function createEditor(options: CreateEditorOptions) {
  const tree = createRootTree(options)
  const editor = createRootEditor(options)
  const Editor = defineComponent({
    name: 'Editor',
    setup() {
      provideDrag()
      return () => {
        return (
          <ProvideRootEditor rootEditor={editor} options={options}>
            <Index></Index>
          </ProvideRootEditor>
        )
      }
    },
  })

  return {
    Editor,
    tree,
    editor,
  }
}
