/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-19 16:36:59
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-26 18:15:08
 */
import { defineComponent } from 'vue'
import { observer } from '@formily/reactive-vue'
import { useField, useFieldSchema, RecursionField } from '@formily/vue'
import { ArrayField } from '@formily/core'
import {
  ElMessageBox,
  ElCollapse,
  ElCollapseItem,
  ElButton,
} from 'element-plus'
import { useKey, Wrapper } from '../array-base'
import { connectElement } from '@/__builtins__'

export const CollapseArray = connectElement(
  observer(
    defineComponent({
      name: 'CollapseArray',
      setup() {
        const fieldRef = useField<ArrayField>()
        const schemaRef = useFieldSchema()
        const getKey = useKey()
        const remove = async (index: number) => {
          await ElMessageBox.confirm('确认删除', '删除')
          fieldRef.value.remove(index)
        }
        // watch(
        //   () => fieldRef.value.value,
        //   () => {
        //     const field = fieldRef.value
        //     const schema = schemaRef.value
        //     const dataSource = Array.isArray(field.value)
        //       ? field.value.slice()
        //       : []
        //     const length = dataSource.length
        //     const minItems = schema.minItems
        //     if (minItems && length < minItems) {
        //       const num = minItems - length
        //       const arr = []
        //       let now = Date.now()
        //       for (let index = 0; index < num; index++) {
        //         arr.push({
        //           _key: now++
        //         })
        //       }
        //       field.push(...arr)
        //     }
        //   },
        //   {
        //     immediate: true
        //   }
        // )

        return () => {
          const field = fieldRef.value
          const schema = schemaRef.value
          const dataSource = Array.isArray(field.value)
            ? field.value.slice()
            : []
          const length = dataSource.length
          const items = dataSource.map((item, index) => {
            const items = Array.isArray(schema.items)
              ? schema.items[index] || schema.items[0]
              : schema.items
            const key = getKey(item)
            return (
              <ElCollapseItem title={`${field.title}-${index + 1}`} key={key}>
                <div>
                  <RecursionField
                    {...{ schema: items, name: index }}
                  ></RecursionField>
                  {schema.minItems && length <= schema.minItems ? null : (
                    <ElButton
                      type="danger"
                      onClick={() => {
                        remove(index)
                      }}
                    >
                      删除
                    </ElButton>
                  )}
                </div>
              </ElCollapseItem>
            )
          })
          const button =
            schema.maxItems && length >= schema.maxItems ? null : (
              <ElButton
                type="primary"
                onClick={() =>
                  field.push({
                    _key: Date.now(),
                  })
                }
              >
                增加
              </ElButton>
            )

          return (
            <Wrapper>
              <ElCollapse accordion={true}>{items}</ElCollapse>
              {button}
            </Wrapper>
          )
        }
      },
    })
  )
)
