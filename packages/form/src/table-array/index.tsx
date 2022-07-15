/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-19 16:36:59
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-26 15:09:04
 */
import { defineComponent, PropType } from 'vue'
import { observer } from '@formily/reactive-vue'
import { useField, useFieldSchema, RecursionField } from '@formily/vue'
import { ArrayField } from '@formily/core'
import {
  ElMessageBox,
  ElDialog,
  ElButton,
  ElTable,
  ElTableColumn,
} from 'element-plus'
import { Wrapper } from '../array-base'
import { ref } from 'vue'

export type TableArrayaActionsProp = {
  type: 'add' | 'remove'
  title: string
  list: {
    title: string
    index: number
  }[]
}[]

export type TableArrayaLabelListProp = {
  prop: string
  label: string
  [key: string]: any
}[]

export const TableArray = observer(
  defineComponent({
    props: {
      actions: {
        type: Array as PropType<TableArrayaActionsProp>,
      },
      labelList: {
        type: Array as PropType<TableArrayaLabelListProp>,
      },
      disabled: {},
      readOnly: {},
      value: {},
    },
    emits: ['change', 'focus', 'blur'],
    setup(props) {
      const fieldRef = useField<ArrayField>()
      const schemaRef = useFieldSchema()
      const dialogVisible = ref(false)
      const remove = async (index: number) => {
        await ElMessageBox.confirm('确认删除', '删除')
        fieldRef.value.remove(index)
      }
      const indexRef = ref(0)
      const add = (index: number) => {
        if (dialogVisible.value) return
        const field = fieldRef.value
        const dataSource = Array.isArray(field.value) ? field.value.slice() : []
        const length = dataSource.length
        indexRef.value = length
        fieldRef.value?.push({
          _index: index,
          _key: Date.now(),
        })
        dialogVisible.value = true
      }
      const edit = (index: number) => {
        dialogVisible.value = true
        indexRef.value = index
      }
      const actionsFunc = {
        add,
        remove,
        edit,
      } as const

      return () => {
        const field = fieldRef.value
        const schema = schemaRef.value
        const dataSource = Array.isArray(field.value) ? field.value.slice() : []
        const value = dataSource[indexRef.value]
        const tempSchema = Array.isArray(schema.items)
          ? schema.items[value?._index || 0] || schema.items[0]
          : schema.items
        const dialog = dataSource.length ? (
          <ElDialog
            v-model={dialogVisible.value}
            title={tempSchema?.title}
            width="60%"
            destroy-on-close={true}
            {...({} as any)}
          >
            {{
              default: () => (
                <div>
                  <RecursionField
                    {...{ schema: tempSchema, name: indexRef.value }}
                  ></RecursionField>
                </div>
              ),
              footer: () => (
                <div>
                  <ElButton
                    type="primary"
                    onClick={async () => {
                      await field.validate()
                      dialogVisible.value = false
                    }}
                  >
                    保存
                  </ElButton>
                </div>
              ),
            }}
          </ElDialog>
        ) : null
        const actions = props.actions?.map((item) => {
          return (
            <div>
              {item.list.map((d) => {
                return (
                  <ElButton
                    onClick={() => {
                      actionsFunc[item.type](d.index)
                    }}
                  >
                    {d.title}
                  </ElButton>
                )
              })}
            </div>
          )
        })
        return (
          <Wrapper>
            <div style={{ marginBottom: '10px' }}>{actions}</div>
            <ElTable
              data={dataSource}
              stripe
              style={{ width: '100%' }}
              row-key="_key"
            >
              {props.labelList?.map((item) => (
                <ElTableColumn {...item} align="center"></ElTableColumn>
              ))}

              <ElTableColumn label="操作" width="120" align="center">
                {{
                  default: ({ $index }: any) => (
                    <>
                      <ElButton
                        type="text"
                        onClick={() => {
                          edit($index)
                        }}
                      >
                        编辑
                      </ElButton>
                      <ElButton
                        type="text"
                        onClick={() => {
                          remove($index)
                        }}
                      >
                        删除
                      </ElButton>
                    </>
                  ),
                }}
              </ElTableColumn>
            </ElTable>

            {dialog}
          </Wrapper>
        )
      }
    },
  })
)
