/*
 * @Descripttion:
 * @Author: Zhang Yunzhong
 * @Date: 2021-08-11 10:51:24
 * @LastEditors: Zhang Yunzhong
 * @LastEditTime: 2021-08-11 11:09:35
 */
import minimist from 'minimist'

export const argv = minimist(process.argv.slice(2))

export const baseConfig = {
  input: 'src/index.ts',
  plugins: {
    preVue: [
      alias({
        entries: [
          {
            find: '@',
            replacement: `${path.resolve(projectRoot, 'src')}`,
          },
        ],
      }),
    ],
    replace: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    vue: {
      style: {
        preprocessOptions: {
          scss: {
            includePaths: ['node_modules'],
          },
        },
      },
    },
    postVue: [
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      }),
      // Process only `<style module>` blocks.
      PostCSS({
        modules: {
          generateScopedName: '[local]___[hash:base64:5]',
        },
        include: /&module=.*\.[s?]css$/,
      }),
      // Process all `<style>` blocks except `<style module>`.
      PostCSS({ include: /(?<!&module=.*)\.[s?]css$/ }),
      commonjs(),
    ],

    babel: {
      presets: ['@vue/babel-preset-jsx'],
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      babelHelpers: 'bundled',
    },
  },
  acornInjectPlugins: [jsx()],
}
