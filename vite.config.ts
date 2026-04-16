import { defineConfig } from 'vite-plus'

export default defineConfig({
  pack: {
    entry: 'src/*.ts',
    dts: true,
    minify: true,
    deps: { skipNodeModulesBundle: true },
    platform: 'neutral',
    exports: true,
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    singleQuote: true,
    semi: false,
    sortImports: {},
  },
})
