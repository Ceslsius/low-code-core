/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-14 16:56:45
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-02 13:25:41
 */
import { ComponentTree, PageTree, RootTree } from './tree'

export function findTree(
  target: ComponentTree | PageTree | RootTree,
  id: string
):
  | {
      index?: number
      parent?: ComponentTree | PageTree | RootTree
      node?: ComponentTree | PageTree | RootTree
    }
  | undefined {
  if (target.id === id) {
    return {
      node: target,
    }
  } else if (!target?.children) {
    return
  } else {
    for (let index = 0; index < target?.children.length; index++) {
      const element = target?.children[index]
      if (element.id === id) {
        return {
          index,
          parent: target,
          node: element,
        }
      } else {
        const temp = findTree(element, id)
        if (temp) {
          return temp
        }
      }
    }
  }
}
