import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import vue from 'rollup-plugin-vue'
import externalGlobals from 'rollup-plugin-external-globals'
import injectProcessEnv from 'rollup-plugin-inject-process-env'
import babel from '@rollup/plugin-babel'
import image from '@rollup/plugin-image'
import { terser } from 'rollup-plugin-terser'

const presets = () => {
  const externals = {
    vue: 'Vue',
    'element-plus': 'ElementPlus',
    '@formily/reactive-vue': 'Formily.ReactiveVue',
    '@formily/reactive': 'Formily.Reactive',
    '@formily/path': 'Formily.Path',
    '@formily/shared': 'Formily.Shared',
    '@formily/validator': 'Formily.Validator',
    '@formily/core': 'Formily.Core',
    '@formily/json-schema': 'Formily.JSONSchema',
  }
  return [
    typescript({
      tsconfig: './tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          module: 'es2015',
          declaration: true,
          declarationMap: false,
        },
        exclude: ['tests/**/*.ts', 'tests/**/*.tsx'],
      },
    }),
    resolve(),
    commonjs(),
    vue(),
    babel({
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      babelHelpers: 'bundled',
    }),
    // useExternals &&
    //   externalGlobals(externals, {
    //     exclude: ['**/*.{less,sass,scss}'],
    //   }),
    image(),
  ]
}

const createEnvPlugin = (env) => {
  return injectProcessEnv(
    {
      NODE_ENV: env,
    },
    {
      exclude: '**/*.{css,less,sass,scss}',
      verbose: false,
    }
  )
}

const inputFilePath = path.join(process.cwd(), 'src/index.ts')
export const removeImportStyleFromInputFilePlugin = () => ({
  name: 'remove-import-style-from-input-file',
  transform(code, id) {
    // 样式由 build:style 进行打包，所以要删除入口文件上的 `import './style'`
    if (inputFilePath === id) {
      return code.replace(`import './style';`, '')
    }

    return code
  },
})

export default (filename, targetName, ...plugins) => [
  {
    input: 'src/index.ts',
    output: {
      format: 'umd',
      file: `dist/${filename}.umd.development.js`,
      name: targetName,
      sourcemap: true,
      amd: {
        id: filename,
      },
    },
    external: ['react', 'react-dom', 'react-is'],
    plugins: [...presets(), ...plugins, createEnvPlugin('development')],
  },
  {
    input: 'src/index.ts',
    output: {
      format: 'umd',
      file: `dist/${filename}.umd.production.js`,
      name: targetName,
      sourcemap: true,
      amd: {
        id: filename,
      },
    },
    external: ['react', 'react-dom', 'react-is'],
    plugins: [
      ...presets(),
      terser(),
      ...plugins,
      createEnvPlugin('production'),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      format: 'cjs',
      file: `lib/index.js`,
      name: targetName,
      sourcemap: true,
      amd: {
        id: filename,
      },
    },
    external: ['vue'],
    plugins: [
      ...presets(false),
      terser(),
      ...plugins,
      createEnvPlugin('production'),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      format: 'es',
      file: `esm/index.js`,
      name: targetName,
      sourcemap: true,
      amd: {
        id: filename,
      },
    },
    external: ['vue'],
    plugins: [
      ...presets(false),
      terser(),
      ...plugins,
      createEnvPlugin('production'),
    ],
  },
]
