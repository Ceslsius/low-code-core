/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-07-06 14:21:56
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-04 11:38:38
 */

export function downLoadJson(file: Blob, name = 'file') {
  const url = window.URL.createObjectURL(file)
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', `${name}.json`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export function fileToJson(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      try {
        const value = JSON.parse(result)
        resolve(value)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = (ev) => {
      reject(ev)
    }
  })
}
