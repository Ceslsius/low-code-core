/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-05 18:00:54
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-26 14:55:33
 */
import { components } from './components'
import { nextTick, PropType, reactive, computed, watch } from 'vue'
import {
  FormProvider,
  createSchemaField,
  FormConsumer,
  createForm,
  ISchema,
} from '@formily/vue'
import { defineComponent } from 'vue'
import { useThrottleFn } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'
import { ElForm } from 'element-plus'

export interface CreateCusFormOptions {
  scope: any
  showData?: boolean
  initialValues?: any
  labelWidth?: string
  size?: string
  schema?: ISchema
  components?: any
}

export const FormData = defineComponent({
  props: {
    values: {},
    changeData: {
      type: Function,
      required: true,
    },
    showData: {},
  },
  setup(props, {}) {
    const temp = computed(() => {
      return props.values
    })

    watch(
      temp,
      () => {
        props.changeData(temp.value)
      },
      {
        deep: true,
      }
    )
    return () => {
      return props.showData ? (
        <div style="white-space: pre">
          {JSON.stringify(props.values, null, 2)}
        </div>
      ) : null
    }
  },
})

export function createCusForm(options: CreateCusFormOptions) {
  const form = createForm({
    initialValues: options.initialValues,
  })
  const { SchemaField } = createSchemaField({
    components: {
      ...components,
      ...options.components,
    },
  })
  const PrivateForm = defineComponent({
    props: {
      changeData: {
        type: Function,
        required: true,
      },
      schema: {
        type: Object as PropType<ISchema>,
        required: true,
      },
    },
    setup(props) {
      return () => {
        return (
          <FormProvider form={form}>
            <SchemaField schema={props.schema} scope={options.scope} />
            <FormConsumer>
              {{
                default: ({ form }: { form: Formily.Core.Models.Form }) => {
                  return (
                    <FormData
                      values={{ ...form.values }}
                      changeData={props.changeData}
                      showData={options.showData}
                    ></FormData>
                  )
                },
              }}
            </FormConsumer>
          </FormProvider>
        )
      }
    },
  })

  const state = reactive({
    schema: options.schema,
    initialValues: options.initialValues,
  })

  async function initForm(config: { values: any; schema?: ISchema }) {
    state.schema = undefined
    await nextTick()
    form.setInitialValues({}, 'overwrite')
    form.setValues({}, 'overwrite')
    state.schema = config.schema
    form.setInitialValues(cloneDeep(config.values), 'overwrite')
    form.setValues(cloneDeep(config.values), 'overwrite')
  }

  const Form = defineComponent({
    props: {
      submit: {
        type: Boolean,
        default: true,
      },
    },
    setup(props, { emit }) {
      const changeData = useThrottleFn((value) => {
        emit('changeData', value)
        if (props.submit) {
          setTimeout(() => {
            form.submit()
          }, 50)
        }
      }, 50)
      return () => {
        return (
          <ElForm
            label-weidth={options.labelWidth || 'auto'}
            size={options.size || 'mini'}
          >
            {state.schema ? (
              <PrivateForm
                changeData={changeData}
                schema={state.schema as ISchema}
              ></PrivateForm>
            ) : null}
          </ElForm>
        )
      }
    },
  })

  return {
    Form,
    initForm,
    form,
  }
}
