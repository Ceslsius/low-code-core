/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-14 16:55:23
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-31 16:49:47
 */
import { cloneDeep, identity } from 'lodash'
import {
  DeepReadonly,
  getCurrentInstance,
  reactive,
  readonly,
  Ref,
  ref,
} from 'vue'
import { Bridge } from '../utils'
import { findTree } from './findTree'
import type { BridgeOptions } from '../utils'
import { ISchema } from '@formily/json-schema'
import { PropType } from 'vue'

export interface BaseTree {
  id: string
  name: string
  component: string
  decorator?: string
  decoratorProps?: string
  decoratorStyles?: string
  style?: any
  props?: any
  config?: any
  hasSlots: boolean
  description: string
  img?: string
  children?: BaseTree[]
  /**
   * children 只能是这些组件
   */
  childrenComponents?: string[]
}

export interface CreateTreeOptions extends BridgeOptions {
  initTree?: RootTree
  mode?: RenderMode
}

export interface RootTree extends BaseTree {
  type: 'root'
  children: PageTree[]
}

export interface PageTree extends BaseTree {
  type: 'page'
  path: string
  hasSlots: true
  children: ComponentTree[]
}

export interface ComponentTree extends BaseTree {
  type: 'component'
  children?: ComponentTree[]
}

export interface CustomPropOptions<T = any, D = T> {
  type?: PropType<T> | true | null
  required?: boolean
  default?: D | object
  validator?(value: unknown): boolean
  editor?: ISchema | (() => ISchema)
}

export type AllTree = RootTree | PageTree | ComponentTree

export interface TreeFormSchema {
  id: string
  style?: ISchema
  props?: ISchema
  config?: ISchema
}
export enum RenderMode {
  /**
   * 编辑
   */
  EDIT = 'EDIT',
  /**
   * 预览
   */
  BROWSE = 'BROWSE',
}

function __getSchema(editor: ISchema | (() => ISchema)) {
  if (editor instanceof Function) {
    return editor()
  } else {
    return editor
  }
}

const _getSchema = (
  id: string,
  component?: {
    props: Record<string, CustomPropOptions>
  }
): TreeFormSchema => {
  if (component) {
    const props = component.props
    const propsSchema: ISchema = {
      type: 'object',
      title: '组件属性',
      properties: {},
    }
    let styleSchema: ISchema
    let configSchema: ISchema

    Object.keys(props).forEach((item) => {
      const temp = props[item]
      if (!temp.editor) return
      if (item === 'style') {
        styleSchema = __getSchema(temp.editor)
      } else if (item === 'config') {
        configSchema = __getSchema(temp.editor)
      } else {
        Object.assign(propsSchema.properties, {
          [item]: __getSchema(temp.editor),
        })
      }
    })
    return {
      id,
      style:
        styleSchema && Object.keys(styleSchema.properties).length
          ? styleSchema
          : undefined,
      props: Object.keys(propsSchema.properties).length
        ? propsSchema
        : undefined,
      config:
        configSchema && Object.keys(configSchema.properties).length
          ? configSchema
          : undefined,
    }
  }
  return { id }
}
export interface MoveData {
  node: ComponentTree
  targetNode: ComponentTree
  type: 'after' | 'before' | 'inner'
}
export interface Tree {
  brige: Bridge
  rootTree: DeepReadonly<Ref<RootTree | undefined>>
  activityComponentTree: DeepReadonly<Ref<PageTree | ComponentTree | undefined>>
  activityPageTree: DeepReadonly<Ref<PageTree | undefined>>
  formSchema: DeepReadonly<Ref<TreeFormSchema | undefined>>
  mode: DeepReadonly<Ref<RenderMode>>
  addComponentTree: (data: ComponentTree) => Promise<void>
  initRootTree: (data: RootTree) => Promise<void>
  setRootTree: (data: Partial<RootTree>) => Promise<void>
  useBrige: <T, D = void>(
    name: string,
    func: (data: T) => D | Promise<D>,
    emitCb?: (data: any) => void
  ) => (data: T) => Promise<D>
  setActivityComponent: (data: string) => Promise<void>
  deleteComponentTree: (data: string) => Promise<void>
  setActivityComponentTree: (
    data: Partial<ComponentTree | PageTree>
  ) => Promise<void>
  setMode: (data: RenderMode) => Promise<void>
  setActivityPageTree: (data: string) => Promise<void>
  addPage: (data: PageTree) => Promise<void>
  move: (data: MoveData) => Promise<void>
  deletePageTree: (data: string) => Promise<void>
  clearPage: (data: unknown) => Promise<void>
}

export function createRootTree(options: CreateTreeOptions): Tree {
  const brige = new Bridge({
    type: options.type,
    iframeId: options.iframeId,
  })

  const useBrige = <T, D = void>(
    name: string,
    func: (data: T) => Promise<D> | D,
    emitCb?: (data: any) => void
  ): ((data: T) => Promise<D>) => {
    brige.on(name, async (data: T, cb) => {
      const value = await func(data)
      cb(value)
    })
    const temp = (data: T) => {
      return new Promise<D>(async (resolve) => {
        const value = await func(data)
        brige.emit(name, cloneDeep(data), (v) => {
          resolve(value)
          emitCb && emitCb(v)
        })
      })
    }
    return temp
  }

  const rootTree = ref<RootTree>()
  const mode = ref(options.mode || RenderMode.BROWSE)
  const setMode = useBrige('setMode', (value: RenderMode) => {
    mode.value = value
  })

  const activityComponentTree = ref<ComponentTree | PageTree>()
  const activityPageTree = ref<PageTree>()
  const formSchema = ref<TreeFormSchema>({ id: '' })

  const initRootTree = useBrige('initRootTree', (tree: RootTree) => {
    rootTree.value = tree
    activityPageTree.value = rootTree.value?.children[0]
    activityComponentTree.value = rootTree.value?.children[0]
  })

  const _setActivityPageTree = useBrige(
    '_setActivityPageTree',
    (path: string) => {
      const page = rootTree.value?.children?.find((item) => {
        return item.path === path
      })
      if (page) {
        activityPageTree.value = page
      }
    }
  )

  const setActivityPageTree = useBrige(
    'setActivityPageTree',
    async (path: string) => {
      await _setActivityPageTree(path)
      const page = rootTree.value?.children?.find((item) => {
        return item.path === path
      })
      if (page) {
        setActivityComponent(page.id)
      }
    }
  )
  const addPage = useBrige('addPage', (pageTree: PageTree) => {
    rootTree.value?.children.push(pageTree)
  })

  const setRootTree = useBrige('setRootTree', (tree: Partial<RootTree>) => {
    if (!rootTree.value) {
      rootTree.value = tree as any
      return
    }
    Object.assign(rootTree.value, {
      ...tree,
      id: rootTree.value?.id,
    })
  })

  function __addComponentTree(
    target: PageTree | ComponentTree,
    tree: ComponentTree,
    id: string
  ) {
    if (target) {
      const temp = findTree(target, id)
      const node = temp.node

      if (node.hasSlots) {
        const children = node?.children as ComponentTree[]
        if (node?.childrenComponents?.indexOf(tree.component) === -1) {
          return __addComponentTree(target, tree, temp.parent.id)
        } else if (children?.length) {
          children.push(tree)
        } else {
          node.children = [tree]
        }
      } else {
        return __addComponentTree(target, tree, temp.parent.id)
      }
    } else {
      throw new Error(`no ${target.name}`)
    }
  }

  const _addComponentTree = useBrige(
    '_addComponentTree',
    (tree: ComponentTree) => {
      const temp = findTree(activityPageTree.value, tree.id)
      if (temp) {
        return
      }
      __addComponentTree(
        activityPageTree.value,
        tree,
        activityComponentTree.value?.id
      )
    }
  )

  const addComponentTree = useBrige(
    'addComponentTree',
    async (tree: ComponentTree) => {
      await _addComponentTree(tree)
      setActivityComponent(tree.id)
    }
  )
  const _deleteComponentTree = useBrige(
    '_deleteComponentTree',
    async (id: string) => {
      const temp = findTree(activityPageTree.value, id)
      if (temp.parent && temp.index != undefined) {
        temp.parent?.children.splice(temp.index, 1)
      }
      return temp
    }
  )

  const deleteComponentTree = useBrige(
    'deleteComponentTree',
    async (id: string) => {
      const temp = await _deleteComponentTree(id)
      if (temp.index === 0) {
        setActivityComponent(temp.parent.id)
      } else {
        setActivityComponent(temp.parent?.children[temp.index].id)
      }
    }
  )

  const _deletePageTree = useBrige('_deletePageTree', async (id: string) => {
    const temp = rootTree.value.children.findIndex((item) => {
      return (item.id = id)
    })
    if (temp != -1) {
      rootTree.value.children.splice(temp, 1)
    }
  })

  const deletePageTree = useBrige('deletePageTree', async (id: string) => {
    await _deletePageTree(id)
    activityPageTree.value = undefined
    activityComponentTree.value = undefined
  })

  const clearPage = useBrige('clearPage', async () => {
    activityPageTree.value.children = []
  })

  const _setActivityComponent = useBrige(
    '_setActivityComponent',
    (id: string) => {
      const temp = findTree(activityPageTree.value, id)
      if (temp.node?.type === 'root') return
      activityComponentTree.value = temp.node
    }
  )
  const ins = getCurrentInstance()

  const setFormSchema = useBrige(
    'setFormSchema',
    async (schema: TreeFormSchema) => {
      formSchema.value = schema
    }
  )

  const move = useBrige('move', (data: MoveData) => {
    const nodeTemp = findTree(rootTree.value, data.node.id)
    nodeTemp.parent?.children.splice(nodeTemp.index, 1)
    const targetNodeTemp = findTree(rootTree.value, data.targetNode.id)
    if (data.type === 'inner') {
      const node = nodeTemp.node
      if (targetNodeTemp.node.children) {
        targetNodeTemp.node.children.push(node as any)
      } else {
        targetNodeTemp.node.children = [node as any]
      }
    } else if (data.type === 'after') {
      targetNodeTemp.parent?.children.splice(
        targetNodeTemp.index + 1,
        0,
        nodeTemp.node as any
      )
    } else if (data.type === 'before') {
      if (targetNodeTemp.index === 0) {
        targetNodeTemp.parent?.children.unshift(nodeTemp.node as any)
      } else {
        targetNodeTemp.parent?.children.splice(
          targetNodeTemp.index,
          0,
          nodeTemp.node as any
        )
      }
    }
  })

  const setActivityComponent = useBrige(
    'setActivityComponent',
    async (id: string) => {
      await _setActivityComponent(id)
      if (options.type === 'iframe') {
        const component = ins.appContext.components[
          activityComponentTree.value.component
        ] as unknown as {
          props: Record<string, CustomPropOptions>
        }
        console.time('setFormSchema')

        await setFormSchema(
          _getSchema(activityComponentTree.value?.id, component)
        )
        console.timeEnd('setFormSchema')
      }
    }
  )

  const setActivityComponentTree = useBrige(
    'setActivityComponentTree',
    async (tree: Partial<PageTree | ComponentTree>) => {
      if (tree.id != activityComponentTree.value.id) {
        return
      }
      Object.assign(activityComponentTree.value, tree)
    }
  )

  if (options.initTree) {
    initRootTree(options.initTree)
  }

  return {
    brige,
    rootTree: readonly(rootTree),
    activityComponentTree: readonly(activityComponentTree),
    activityPageTree: readonly(activityPageTree),
    formSchema: readonly(formSchema),
    mode: readonly(mode),
    addComponentTree,
    initRootTree,
    useBrige,
    setActivityComponent,
    deleteComponentTree,
    setActivityComponentTree,
    setMode,
    setRootTree,
    setActivityPageTree,
    addPage,
    move,
    deletePageTree,
    clearPage,
  }
}
