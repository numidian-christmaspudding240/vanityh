import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    platform: "browser",
    dts: true,
    minify: true,
    exports: true,
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
});
