/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-10 10:08:37
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-11 12:40:54
 */
const devPresets = ['@vue/babel-preset-app']
const buildPresets = [
  [
    '@babel/preset-env',
    // Config for @babel/preset-env
    {
      // Example: Always transpile optional chaining/nullish coalescing
      // include: [
      //   /(optional-chaining|nullish-coalescing)/
      // ],
    },
  ],
  '@babel/preset-typescript',
]
module.exports = {
  presets: process.env.NODE_ENV === 'development' ? devPresets : buildPresets,
}
