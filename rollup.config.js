import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

const noDeclarationFiles = { compilerOptions: { declaration: false } }

const external = [
  'redux',
  'react-redux',
  'redux-persist',
  'redux-persist/integration/react',
  'redux-persist/lib/storage',
  'redux-devtools-extension',
  'immer',
  'redux-logger',
]

export default [
  // CommonJS
  {
    input: 'src/index.ts',
    output: { file: pkg.main, format: 'cjs' },
    external,
    plugins: [
      typescript({ useTsconfigDeclarationDir: true }),
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  },

  // ES
  {
    input: 'src/index.ts',
    output: { file: pkg.module, format: 'es' },
    external,
    plugins: [
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  },

  // UMD
  {
    input: 'src/index.ts',
    output: {
      name: 'dream-redux',
      file: pkg.browser,
      format: 'umd',
      globals: {
        redux: 'Redux',
        'react-redux': 'ReactRedux',
        'redux-persist': 'ReduxPersist',
        'redux-persist/integration/react': 'ReduxPersistReact',
        'redux-persist/lib/storage': 'ReduxPersistStorage',
        'redux-devtools-extension': 'ReduxDevtoolsExtension',
        immer: 'Immer',
        'redux-logger': 'ReduxLogger',
      },
    },
    plugins: [
      typescript({ tsconfigOverride: noDeclarationFiles }),
      resolve(),
      commonjs({
        include: ['**/node_modules/**'],
      }),
      babel({
        exclude: 'node_modules/**',
      }),
    ],
    external,
  },
]
