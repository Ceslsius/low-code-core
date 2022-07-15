/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-19 16:36:59
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-17 16:00:12
 */
import { defineComponent } from 'vue'
import { observer } from '@formily/reactive-vue'
import { useField, useFieldSchema, RecursionField } from '@formily/vue'
import { ArrayField } from '@formily/core'
import { ElMessageBox, ElButton } from 'element-plus'
import { useKey, Wrapper } from '../array-base'

export const ArrayItems = observer(
  defineComponent({
    setup() {
      const fieldRef = useField<ArrayField>()
      const schemaRef = useFieldSchema()
      const getKey = useKey()
      const remove = async (index: number) => {
        await ElMessageBox.confirm('确认删除', '删除')
        fieldRef.value.remove(index)
      }

      return () => {
        const field = fieldRef.value
        const schema = schemaRef.value
        const dataSource = Array.isArray(field.value) ? field.value.slice() : []

        const items = dataSource.map((item, index) => {
          const items = Array.isArray(schema.items)
            ? schema.items[index] || schema.items[0]
            : schema.items
          const key = getKey(item)
          return (
            <div key={key}>
              <div>
                <RecursionField
                  {...{ schema: items, name: index }}
                ></RecursionField>
                <ElButton
                  type="danger"
                  onClick={() => {
                    remove(index)
                  }}
                >
                  删除
                </ElButton>
              </div>
            </div>
          )
        })
        const button = (
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
            {items}
            {button}
          </Wrapper>
        )
      }
    },
  })
)
