/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-16 11:44:19
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-17 11:03:29
 */

import { PropType } from 'vue'
import { defineComponent, provide } from 'vue'
import { CreateEditorOptions, Editor } from '../@types'

export const ProvideRootEditor = defineComponent({
  name: 'ProvideRootEditor',
  props: {
    rootEditor: Object as PropType<Editor>,
    options: Object as PropType<CreateEditorOptions>,
  },
  setup(props, { slots }) {
    provide('editor.rootEditor', props.rootEditor)
    provide('editor.options', props.options)
    return () => slots.default?.()
  },
})
