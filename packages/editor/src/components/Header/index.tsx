/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-02 14:56:52
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-19 10:16:56
 */
import { RootTree, useTree } from '@koznak/tree'
import {
  ElMessage,
  ElMessageBox,
  ElRow,
  ElCol,
  ElButton,
  ElDialog,
} from 'element-plus'
import { defineComponent, ref } from 'vue'
import { downLoadJson } from '@/utils'
import { JsonEditor } from '../JsonEditor'
import { useRootEditor } from '@/composables'
import { cloneDeep } from 'lodash-es'
import { PropType } from 'vue'
import './style.scss'

const CusHeader = defineComponent({
  props: {
    tools: {
      type: Array as PropType<any[]>,
      required: true,
    },
  },
  setup(props) {
    const editor = useRootEditor()

    function save() {
      editor.save({
        rootTree: rootTree.value as RootTree,
      })
    }
    const { rootTree } = useTree()
    return () => (
      <div>
        <ElRow type="flex" class="kz-editor-header" align="center">
          <ElCol span={6} class="left-tools">
            <div class="title">H5编辑器</div>
          </ElCol>
          <ElCol class="center-tools" span={12}>
            {props.tools.map((item, index) => {
              return (
                <div class="tool-item" onClick={item.onClick} key={index}>
                  <i class={item.icon}></i>
                  <div class="title">{item.title}</div>
                </div>
              )
            })}
          </ElCol>
          <ElCol span={6} class="right-tools">
            <div>
              <ElButton type="primary" onClick={save}>
                保存
              </ElButton>
            </div>
          </ElCol>
        </ElRow>
      </div>
    )
  },
})

export const Header = defineComponent({
  setup() {
    const {
      rootTree,
      initRootTree,
      setActivityComponent,
      activityPageTree,
      clearPage,
      setActivityComponentTree,
    } = useTree()
    const editor = useRootEditor()
    const dialogVisible = ref(false)
    const tools = [
      {
        title: '导入JSON',
        icon: 'el-icon-upload2',
        onClick: () => {
          dialogVisible.value = true
        },
      },
      {
        title: '导出JSON',
        icon: 'el-icon-download',
        onClick: () => {
          downLoadJson(
            new Blob([JSON.stringify(rootTree.value)]),
            rootTree.value?.name
          )
          ElMessage.success('下载成功')
        },
      },
      {
        title: '真机预览',
        icon: 'el-icon-mobile-phone',
        onClick: () => {
          ElMessage('敬请期待')
        },
      },
      {
        title: '复制链接',
        icon: 'el-icon-document-copy',
        onClick: () => {
          editor.config.copyUrl()
        },
      },
      {
        title: '重做',
        icon: 'el-icon-refresh-right',
        onClick: async () => {
          await ElMessageBox.confirm(
            '确认重做?重做将清空所有页面和配置',
            '重做'
          )
          const tempTree = cloneDeep(rootTree.value) as RootTree
          tempTree?.config && (tempTree.config = {})
          tempTree?.children && (tempTree.children = [])
          initRootTree(tempTree)
          editor.setFormMode('root')
        },
      },
      {
        title: '清空页面',
        icon: 'el-icon-delete',
        onClick: async () => {
          await ElMessageBox.confirm(
            '确认清空页面?清空页面将清空当前页面配置和样式',
            '清空页面'
          )
          await setActivityComponentTree({
            config: {},
            props: {},
            style: {},
          })
          await setActivityComponent(activityPageTree.value?.id as string)

          clearPage('')
        },
      },
      {
        title: '预览',
        icon: 'el-icon-position',
        onClick: () => {
          ElMessage('敬请期待')
        },
      },
    ]

    const jsonStr = ref('')
    return () => {
      return (
        <div>
          <ElDialog
            title="导入JSON"
            width="80%"
            v-model={dialogVisible.value}
            {...({} as any)}
          >
            {{
              default: () => (
                <div>
                  <JsonEditor
                    {...{
                      onChange: (value: string) => {
                        jsonStr.value = value
                      },
                    }}
                  ></JsonEditor>
                </div>
              ),
              footer: () => (
                <span class="dialog-footer">
                  <ElButton
                    onClick={() => {
                      dialogVisible.value = false
                    }}
                  >
                    取 消
                  </ElButton>
                  <ElButton
                    type="primary"
                    onClick={() => {
                      const tempTree = JSON.parse(jsonStr.value) as RootTree
                      rootTree.value?.id && (tempTree.id = rootTree.value?.id)
                      rootTree.value?.name &&
                        (tempTree.name = rootTree.value?.name)
                      initRootTree(tempTree)
                      dialogVisible.value = false
                    }}
                  >
                    确 定
                  </ElButton>
                </span>
              ),
            }}
          </ElDialog>
          <CusHeader {...{ tools }}></CusHeader>
        </div>
      )
    }
  },
})
