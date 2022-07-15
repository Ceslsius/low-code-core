/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-06-29 10:54:19
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-17 18:22:21
 */
import { useDrag } from '@/composables'
import { ComponentTree } from '@koznak/tree'
import { useTree } from '@koznak/tree'
import { ElTooltip } from 'element-plus'
import { ref, defineComponent } from 'vue'
import './style.scss'
export const List = defineComponent({
  name: 'List',
  setup() {
    const componentsList = ref<ComponentTree[]>([])

    function dragstart(ev: DragEvent, item: ComponentTree) {
      setIsDrag && setIsDrag(true)
      ev.dataTransfer?.setData('component', JSON.stringify(item))
    }
    const { brige, activityComponentTree } = useTree()
    brige.on('setComponentsList', (list) => {
      componentsList.value = list
    })
    function drag(ev: DragEvent, item: ComponentTree) {
      ev.dataTransfer?.setData('component', JSON.stringify(item))
    }
    const { setIsDrag } = useDrag()

    function dragend(ev: DragEvent, item: ComponentTree) {
      console.log(ev, item)

      setIsDrag && setIsDrag(false)
    }
    return () => {
      return (
        <div class="kz-component-list">
          {componentsList.value.map((item) => {
            const show =
              !activityComponentTree ||
              (activityComponentTree &&
                !activityComponentTree.value?.childrenComponents) ||
              (activityComponentTree &&
                activityComponentTree.value?.childrenComponents &&
                activityComponentTree.value?.childrenComponents.includes(
                  item.component
                ))
            return (
              <div
                key="item.id"
                draggable="true"
                class="kz-component-list-item"
                v-show={show}
                onDragstart={(ev) => {
                  dragstart(ev, item)
                }}
                onDrag={(ev) => {
                  drag(ev, item)
                }}
                onDragend={(ev) => {
                  dragend(ev, item)
                }}
              >
                <div
                  class="kz-component-list-item-bg"
                  style={{
                    backgroundImage: `url(${item.img})`,
                  }}
                ></div>
                <ElTooltip
                  class="item"
                  effect="dark"
                  content={item.description}
                  placement="top-start"
                  {...({} as any)}
                >
                  <div>{item.name}</div>
                </ElTooltip>
              </div>
            )
          })}
        </div>
      )
    }
  },
})
