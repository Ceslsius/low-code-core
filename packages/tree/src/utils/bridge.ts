/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-06 12:27:33
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-31 16:50:33
 */

import { cloneDeep } from 'lodash'

interface BrigeCallBackResponse {
  funcId: string | number
  data: any
  type: BridgeEmitTypeEnum | string
  name: string | Bridgekey
}

type ResponseCallback<D> = (data: D) => void

export interface Bridgekey<T = any, D = any> extends String {
  data?: T
  cbData?: D
}

export interface BridgeOptions {
  type: 'iframe' | 'custom'
  iframeBrigeCallBackName?: string
  iframeId?: string
}

export enum BridgeEmitTypeEnum {
  ON = 'ON',
  EMIT = 'EMIT',
  ONCE = 'ONCE',
}

/**
 * 支持iframe通信和内部事件分发
 */
export class Bridge {
  private options!: BridgeOptions
  constructor(options: BridgeOptions) {
    this.options = options
    this.createBrigeCallBack()
  }

  private createBrigeCallBack() {
    if (this.options.type === 'iframe') {
      this.createIframeBrigeCallBack()
    } else {
      this.createCustomBrigeCallBack()
    }
  }

  private createIframeBrigeCallBack() {
    window[this.options.iframeBrigeCallBackName || 'evalIframeBrigeCallBack'] =
      async (response: BrigeCallBackResponse) => {
        if (response.type === BridgeEmitTypeEnum.EMIT) {
          const func = this.emitCbFuncMap.get(response.funcId)
          if (func) {
            await func(response.data)
            this.emitCbFuncMap.delete(response.funcId)
          }
        } else if (
          response.type === BridgeEmitTypeEnum.ON ||
          response.type === BridgeEmitTypeEnum.ONCE
        ) {
          const cb = (data: any) => {
            this.sendData({
              funcId: response.funcId,
              name: response.name,
              data,
              type: BridgeEmitTypeEnum.EMIT,
            })
          }
          this.triggerEmit(response.name, response.data, cb)
        }
      }
  }

  private createCustomBrigeCallBack() {
    window.addEventListener(
      'message',
      async (e) => {
        const response: BrigeCallBackResponse = e.data

        if (response.type === BridgeEmitTypeEnum.EMIT) {
          const func = this.emitCbFuncMap.get(response.funcId)
          if (func) {
            await func(response.data)
            this.emitCbFuncMap.delete(response.funcId)
          }
        } else if (
          response.type === BridgeEmitTypeEnum.ON ||
          response.type === BridgeEmitTypeEnum.ONCE
        ) {
          const cb = (data: any) => {
            this.sendData({
              funcId: response.funcId,
              name: response.name,
              data,
              type: BridgeEmitTypeEnum.EMIT,
            })
          }
          this.triggerEmit(response.name, response.data, cb)
        }
      },
      true
    )
  }
  iframe!: HTMLIFrameElement

  private sendData(data: BrigeCallBackResponse) {
    if (this.options.type === 'custom') {
      if (!this.iframe) {
        this.iframe = document.getElementById(
          this.options.iframeId || 'iframe'
        ) as HTMLIFrameElement
      }
      const contentWindow = this.iframe?.contentWindow
      if (contentWindow) {
        const func =
          contentWindow[
            this.options.iframeBrigeCallBackName || 'evalIframeBrigeCallBack'
          ]
        func && func(data)
      }
    } else {
      try {
        window.parent.postMessage(
          cloneDeep(data),
          window.parent.location.origin
        )
      } catch (error) {
        console.error(error)
      }
    }
  }

  private onMap: Map<string | Bridgekey<any, any>, Set<Function>> = new Map()
  private emitCbFuncMap: Map<number | string, Function> = new Map()

  on<T = any, D = any>(
    name: string | Bridgekey<T, D>,
    cb: (data: T, cb: (data?: D) => void) => void
  ) {
    const onSet = this.onMap.get(name)
    if (onSet) {
      onSet.add(cb)
    } else {
      this.onMap.set(name, new Set([cb]))
    }
  }

  clear<T = any, D = any>(name: string | Bridgekey<T, D>) {
    this.onMap.delete(name)
  }

  off<T = any, D = any>(
    name: string | Bridgekey<T, D>,
    cb: (data: T) => void
  ): void {
    const onSet = this.onMap.get(name)
    if (onSet) {
      onSet.delete(cb)
    }
  }

  private triggerEmit<T = any, D = any>(
    name: string | Bridgekey<T, D>,
    data: T,
    cb?: ResponseCallback<D>
  ) {
    console.log(name, data)

    const func = this.onMap.get(name)
    if (func) {
      func.forEach((item) => {
        item(data, cb)
      })
    }
  }

  emit<T = any, D = any>(
    name: string | Bridgekey<T, D>,
    data: T,
    cb?: ResponseCallback<D>
  ) {
    console.log(name, data)

    const funcId = Date.now()
    if (cb) {
      this.emitCbFuncMap.set(funcId, cb)
    }

    this.sendData({
      funcId,
      name,
      data,
      type: BridgeEmitTypeEnum.ON,
    })
  }
}
