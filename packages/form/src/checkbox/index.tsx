/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-11 15:54:26
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-19 16:25:18
 */
import { connect, mapProps, SchemaEnum } from '@formily/vue'
import { defineComponent, PropType } from 'vue'
import { ElCheckbox, ElCheckboxGroup } from 'element-plus'
import {
  useFormrRelevant,
  emits,
  useElementProps,
  connectElement,
} from '@/__builtins__'
const elProps = ElCheckboxGroup.props

const KzCheckboxGroup = defineComponent({
  name: 'KzCheckbox',
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
                      <ElCheckbox {...option} label={option.key}>
                        {option.title}
                      </ElCheckbox>
                    )
                  } else {
                    return (
                      <ElCheckbox {...option} label={option.value}>
                        {option.label}
                      </ElCheckbox>
                    )
                  }
                } else {
                  return (
                    <ElCheckbox
                      {...{
                        value: option,
                        label: option,
                      }}
                    >
                      {option}
                    </ElCheckbox>
                  )
                }
              }),
          }
        : slots
      return (
        <ElCheckboxGroup
          {...componentProps.value}
          {...events}
          v-model={valueRef.value}
        >
          {children}
        </ElCheckboxGroup>
      )
    }
  },
})

export const CheckboxGroup = connect(
  KzCheckboxGroup,
  mapProps({ dataSource: 'options', loading: true })
)

export const Checkbox = connect(
  connectElement(ElCheckbox),
  mapProps({
    title: 'label',
  })
)
