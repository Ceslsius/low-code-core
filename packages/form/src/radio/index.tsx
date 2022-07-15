/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-11 15:54:26
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-13 10:01:58
 */
import { connect, mapProps, SchemaEnum } from '@formily/vue'
import { defineComponent, PropType } from 'vue'
import { ElRadioGroup, ElRadio } from 'element-plus'
import { useFormrRelevant, emits, useElementProps } from '@/__builtins__'
const elProps = ElRadioGroup.props

const KzRadioGroup = defineComponent({
  name: 'KzRadioGroup',
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
    const { valueRef, events } = useFormrRelevant(true)
    return () => {
      const options: SchemaEnum<string> = props.options || []
      const children = options.length
        ? {
            default: () =>
              options.map((option: any) => {
                if (typeof option === 'object') {
                  if ('key' in option) {
                    return (
                      <ElRadio {...option} label={option.key}>
                        {option.title}
                      </ElRadio>
                    )
                  } else {
                    return (
                      <ElRadio {...option} label={option.value}>
                        {option.label}
                      </ElRadio>
                    )
                  }
                } else {
                  return (
                    <ElRadio
                      {...{
                        value: option,
                        label: option,
                      }}
                    >
                      {option}
                    </ElRadio>
                  )
                }
              }),
          }
        : slots
      return (
        <ElRadioGroup
          {...componentProps.value}
          {...events}
          v-model={valueRef.value}
        >
          {children}
        </ElRadioGroup>
      )
    }
  },
})

export const RadioGroup = connect(
  KzRadioGroup,
  mapProps({ dataSource: 'options', loading: true })
)
