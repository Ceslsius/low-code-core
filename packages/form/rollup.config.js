// rollup.config.js
import fs from 'fs'
import path from 'path'
import vue from 'rollup-plugin-vue'
import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import babel from '@rollup/plugin-babel'
import PostCSS from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import ttypescript from 'ttypescript'
import typescript from 'rollup-plugin-typescript2'
// Get browserslist config and remove ie from es build targets
const esbrowserslist = fs
  .readFileSync('./.browserslistrc')
  .toString()
  .split('\n')
  .filter(entry => entry && entry.substring(0, 2) !== 'ie')
const files = fs.readdirSync('./src')
console.log(
  files.filter(name => {
    return !(name.includes('.') || name.includes('_'))
  })
)
// Extract babel preset-env config, to combine with esbrowserslist
const babelPresetEnvConfig = require('./babel.config').presets.filter(
  entry => entry[0] === '@babel/preset-env'
)[0][1]

const override = {
  exclude: ['dev']
}
const projectRoot = path.resolve(__dirname)

const baseConfig = {
  input: 'src/index.ts',
  plugins: {
    preVue: [
      alias({
        entries: [
          {
            find: '@',
            replacement: `${path.resolve(projectRoot, 'src')}`
          }
        ]
      })
    ],
    replace: {
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: false
    },
    vue: {
      style: {
        preprocessOptions: {
          scss: {
            includePaths: ['node_modules']
          }
        }
      }
    },
    postVue: [
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue']
      }),
      // Process only `<style module>` blocks.
      PostCSS({
        modules: {
          generateScopedName: '[local]___[hash:base64:5]'
        },
        include: /&module=.*\.[s?]css$/
      }),
      // Process all `<style>` blocks except `<style module>`.
      PostCSS({ include: /(?<!&module=.*)\.[s?]css$/ }),
      commonjs()
    ],

    babel: {
      presets: [],
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      babelHelpers: 'bundled',
      plugins: [['@vue/babel-plugin-jsx']]
    }
  }
  // acornInjectPlugins: [jsx()]
}

// ESM/UMD/IIFE shared settings: externals
// Refer to https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
const external = [
  // list external dependencies, exactly the way it is written in the import statement.
  // eg. 'jquery'
  'vue',
  '@formily/reactive-vue',
  '@formily/reactive',
  '@formily/path',
  '@formily/shared',
  '@formily/validator',
  '@formily/core',
  '@formily/json-schema',
  '@formily/vue',
  '@formily/reactive',
  '@formily/path',
  '@formily/shared',
  '@formily/validator',
  '@formily/core',
  '@formily/json-schema',
  '@formily/vue',
  'element-plus',
  'lodash-es',
  '@vueuse/core'
]
// UMD/IIFE shared settings: output.globals
// Refer to https://rollupjs.org/guide/en#output-globals for details
const globals = {
  // Provide global variable names to replace your external imports
  // eg. jquery: '$'
  vue: 'Vue',
  '@formily/reactive-vue': 'Formily.ReactiveVue',
  '@formily/reactive': 'Formily.Reactive',
  '@formily/path': 'Formily.Path',
  '@formily/shared': 'Formily.Shared',
  '@formily/validator': 'Formily.Validator',
  '@formily/core': 'Formily.Core',
  '@formily/json-schema': 'Formily.JSONSchema',
  '@formily/vue': 'Formily.Vue',
  'element-plus': 'ElementPlus'
}
// Customize configs for individual targets
const buildFormats = []
const esConfig = {
  ...baseConfig,
  external,
  output: {
    file: 'esm/index.js',
    format: 'esm',
    exports: 'named'
  },
  plugins: [
    replace(baseConfig.plugins.replace),
    ...baseConfig.plugins.preVue,
    vue(baseConfig.plugins.vue),
    ...baseConfig.plugins.postVue,
    // Only use typescript for declarations - babel will
    // do actual js transformations

    babel({
      ...baseConfig.plugins.babel,
      presets: [
        [
          '@babel/preset-env',
          {
            ...babelPresetEnvConfig,
            targets: esbrowserslist
          }
        ]
      ]
    })
  ]
}
const cjsConfig = {
  ...baseConfig,
  external,
  output: {
    compact: true,
    file: 'lib/index.js',
    format: 'cjs',
    name: 'KoznakForm',
    exports: 'auto',
    globals
  },
  plugins: [
    replace(baseConfig.plugins.replace),
    ...baseConfig.plugins.preVue,
    vue(baseConfig.plugins.vue),
    ...baseConfig.plugins.postVue,
    typescript({
      typescript: ttypescript,
      emitDeclarationOnly: true,
      tsconfigOverride: override
    }),
    babel(baseConfig.plugins.babel)
  ]
}
const unpkgConfig = {
  ...baseConfig,
  external,
  output: {
    compact: true,
    file: 'dist/koznak-form.min.js',
    format: 'iife',
    name: 'KoznakForm',
    exports: 'auto',
    globals
  },
  plugins: [
    replace(baseConfig.plugins.replace),
    ...baseConfig.plugins.preVue,
    vue(baseConfig.plugins.vue),
    ...baseConfig.plugins.postVue,
    babel(baseConfig.plugins.babel),
    terser({
      output: {
        ecma: 5
      }
    })
  ]
}
buildFormats.push(cjsConfig)
buildFormats.push(esConfig)
buildFormats.push(unpkgConfig)

// Export config
export default buildFormats
