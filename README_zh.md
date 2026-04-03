<h1 align="center">
  VanityH
  <a href="https://www.npmjs.com/package/vanity-h"><img src="https://img.shields.io/npm/v/vanity-h.svg?style=flat" alt="npm version"></a>
</h1>

[English](./README.md)

### 🚀 VanityH: 让 hyperscript 编写变得优雅

**告别嵌套地狱，拥抱流式开发体验**

VanityH 并不是另一个复杂的 UI 框架，它是一个极简的 **DSL (领域特定语言) 构造器**。通过 Proxy 与闭包逻辑，它将繁琐的 `h(tag, props, children)` 调用转换为类似 **SwiftUI** 或 **Flutter** 的链式语法。

---

### 🎯 VanityH 解决的核心痛点

在非 JSX 环境（原生 JS/TS、脚本工具、低代码引擎）中，开发者面临这些困境：

- **嵌套地狱**：传统 `h` 函数需要大量对象嵌套，视觉噪音极大
- **属性污染**：组件复用时意外污染原始定义
- **心智负担**：属性、事件、子节点混杂，难以理解 DOM 结构
- **环境依赖**：JSX 需要编译配置，无法在轻量级脚本或原生浏览器环境中开箱即用

**VanityH 通过"链式配置 + 终结符渲染"完美解决这些问题。**

---

### ✨ 为什么选择 VanityH？

#### 🎨 结构对称美学

VanityH 将属性配置与节点挂载语法分离，代码结构完美映射 DOM 结构。

```js
html.lang("en")(
  head(
    meta.charset("UTF-8")(),
    link.rel("icon").type("image/svg+xml").href("/favicon.svg")(),
    title("VanityH - 极致优雅"),
  ),
  body(div.id("app")(), script.type("module").src("/src/main.ts")()),
);
```

#### 🔒 绝对不可变架构

基于**写时拷贝**哲学，每次属性调用都产生全新状态快照。

```js
const baseBtn = button.class("btn");

const redBtn = baseBtn.style("color: red")("红色按钮");
const blueBtn = baseBtn.style("color: blue")("蓝色按钮"); // baseBtn 保持纯净
```

#### 🔍 零魔法设计

工具不应比开发者更聪明。VanityH 不自动处理布尔值，不设隐式转换，完全透明。

#### 📦 极致轻量与兼容

- **体积**：核心逻辑约 10 行代码，压缩后几乎不占体积
- **兼容性**：支持 Vue、Preact、React、Snabbdom 等任何 hyperscript 渲染器

---

### 🚀 快速开始

#### 安装

**NPM 方式：**

```bash
npm install vanity-h
```

**CDN 方式（无需构建）：**

```html
<script type="module">
  // 使用 esm.sh（推荐）或 unpkg
  import { render, h } from "https://esm.sh/preact";
  import createVanity from "https://esm.sh/vanity-h";
  // 备选方案：https://unpkg.com/vanity-h

  const { div, span } = createVanity(h);

  // 使用 VanityH 创建 UI
  const app = () => div.class("app")(span("Hello World"));

  // 渲染到 DOM
  render(app(), document.getElementById("app"));
</script>
```

#### 基础用法 (Vue 3)

```typescript
import { h } from "vue";
import createVanity from "vanity-h";

// 初始化并解构需要的标签
const { x, div, button, span, h1 } = createVanity(h);

// 2. 包装自定义组件
import MyComp from "./MyComp.vue";

// 创建 UI
const app = div.class("app").style("padding: 20px")(
  h1("VanityH 示例"),
  x(MyComp).theme("dark").onClose(handleClose)(), // 使用 x 包装器
  button.onClick(() => alert("Hello!"))("点击我"),
  span.style("color: blue")("体验优雅的链式调用"),
);
```

#### 在 Playground 中尝试

在浏览器中立即体验 VanityH：

[![在 StackBlitz 中尝试](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/vitejs-vite-bujruupx)

#### 传统写法 vs VanityH

```js
// 传统 hyperscript 写法
h(
  "div",
  {
    class: "card",
    style: "padding: 20px",
  },
  [
    h(
      "button",
      {
        class: "btn-primary",
        onClick: handleClick,
      },
      "Click me",
    ),
  ],
);

// VanityH 写法
div.class("card").style("padding: 20px")(
  button.class("btn-primary").onClick(handleClick)("Click me"),
);
```

---

### 🛠 实现原理

VanityH 内部利用 JavaScript 的 **Proxy** 拦截 `get` 操作，结合**递归闭包**管理状态：

- **配置态**：访问属性时返回新 Proxy，内部闭包持有累加的 `props` 对象
- **执行态**：Proxy 作为函数调用时，将 `props` 和 `children` 提交给渲染引擎

---

### 🔧 TypeScript 支持

VanityH 提供深度优化的类型推导：

```typescript
import createVanity, { type VanityH } from "vanity-h";
import { h, VNode } from "vue";

// 强类型声明
const v: VanityH<VNode> = createVanity(h);

// 类型检查
const element = v.div.class("test").id("app")("内容");
```

---

### 📊 性能表现

- **体积**: ~600 字节 (gzipped)
- **零依赖**: 纯 JavaScript 实现
- **高性能**: Proxy 拦截开销几乎可忽略
- **内存友好**: 基于闭包的不可变设计

---

### 🤝 贡献指南

我们欢迎各种形式的贡献！

#### 开发环境设置

```bash
git clone https://github.com/VanityH/vanityh.git
cd vanityh
npm install
npm run dev  # 启动开发服务器
```

---

### 📄 开源协议

MIT License © 2026 VanityH Team

**VanityH**：让手写 Render 函数不再是痛苦，而是一种享受。

---

### 🙏 致谢

感谢以下项目为 VanityH 提供的灵感：

- [HTM](https://github.com/developit/htm) - JSX 语法的替代方案
- [DLight](https://github.com/dlight-js/dlight) - DX-first 的 UI 渲染库
- [Hyperscript](https://github.com/hyperhype/hyperscript) - 创建 HTML 的 JavaScript
- [SwiftUI](https://developer.apple.com/swiftui) - 声明式 UI 框架

特别感谢所有为开源社区做出贡献的开发者！
