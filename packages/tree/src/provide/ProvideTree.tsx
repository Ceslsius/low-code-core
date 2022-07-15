/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-12 18:00:01
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-07-14 18:41:02
 */
import { defineComponent, PropType, provide } from 'vue'
import { Tree } from './tree'

export const ProvideTree = defineComponent({
  name: 'ProvideTree',
  props: {
    tree: {
      type: Object as PropType<Tree>,
      required: true,
    },
  },
  setup(props, { slots }) {
    provide('editor.tree', props.tree)
    return () => slots.default && slots.default()
  },
})
