import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'
import swc from 'unplugin-swc'

export default defineConfig({
  test: {
    globals: true,
    root: './',
    dir: 'src',
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          dir: 'src/domain',
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          dir: 'src/infra',
          setupFiles: ['./test/setup-e2e.ts'],
        },
      },
    ],
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})