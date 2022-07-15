/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2020-09-11 14:08:42
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-02 16:37:05
 */
declare interface Window {
  WebViewJavascriptBridge: WebViewJavascriptBridge
  getInstance: (option: any) => any
  evalJsBridgeCallBack: (data: string) => void
  evalIframeBrigeCallBack: (data: string) => void
  [key: string]: any
}

interface NetworkInformation {
  readonly: number
  readonly effectiveType: string
  readonly onchange?: any
  readonly rtt: number
  readonly saveData: boolean
  readonly type: string
}
declare interface Navigator {
  readonly connection?: NetworkInformation
  readonly webkitConnection?: NetworkInformation
}

interface WebViewJavascriptBridge {
  /**
   * WebViewJavascriptBridge 初始化
   */
  init: () => void
  /**
   * WebViewJavascriptBridge 注册事件
   */
  registerHandler: IRegisterHandler

  /**
   * WebViewJavascriptBridge 调用事件
   */
  callHandler: ICallHandler

  /**
   * WebViewJavascriptBridge 发送消息
   */
  send: () => void
}
type IRegisterHandler = (
  /**
   * 注册的与原生通信事件名字
   */
  name: string,
  /**
   * 原生调用的回调函数
   */
  responseCallback: (data: any, responseCallback: IResponseCallback) => void
) => void
type IResponseCallback = (data: any) => void

type ICallHandler = (
  name: string,
  data: any,
  responseCallback: IResponseCallback
) => void

declare module 'jsonlint-mod'
