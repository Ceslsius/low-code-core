/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-11 15:54:26
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-13 10:02:01
 */
import { connect, mapProps, SchemaEnum } from '@formily/vue'
import { defineComponent, PropType } from 'vue'
import { ElSelect, ElOption } from 'element-plus'
import { useFormrRelevant, emits, useElementProps } from '@/__builtins__'
const elProps = ElSelect.props

const KzSelect = defineComponent({
  name: 'KzSelect',
  props: {
    ...elProps,
    options: {
      type: Array as PropType<any>,
      default: () => {
        return []
      },
    },
    value: {},
    modelValue: {},
  },
  emits,
  setup(props, { slots }) {
    const componentProps = useElementProps(Object.keys(elProps))
    const { valueRef, events } = useFormrRelevant()
    return () => {
      const options: SchemaEnum<string> = props.options || []
      const children = options.length
        ? {
            default: () =>
              options.map((option: any) => {
                if (typeof option === 'object') {
                  if ('key' in option) {
                    return (
                      <ElOption
                        {...option}
                        {...{
                          value: option.key,
                          label: option.title,
                        }}
                      ></ElOption>
                    )
                  } else {
                    return <ElOption {...option}></ElOption>
                  }
                } else {
                  return (
                    <ElOption
                      {...{
                        value: option,
                        label: option,
                      }}
                    ></ElOption>
                  )
                }
              }),
          }
        : slots
      return (
        <ElSelect
          {...componentProps.value}
          {...events}
          v-model={valueRef.value}
        >
          {children}
        </ElSelect>
      )
    }
  },
})

export const Select = connect(
  KzSelect,
  mapProps({ dataSource: 'options', loading: true })
)
