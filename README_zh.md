# VanityH

[English](./README.md)

**极致轻量、不可变的流式渲染工厂 (Fluent Hyperscript Factory)**

VanityH 并不是另一个复杂的 UI 框架，它是一个极简的 **DSL (领域特定语言) 构造器**。它通过 Proxy 与闭包逻辑，将枯燥的 `h(tag, props, children)` 调用演变为一种像 **SwiftUI** 或 **Flutter** 一样具有高度节奏感的流式开发体验。

---

## ⚡️ 核心痛点：它解决了什么？

在非 JSX 环境（如原生 JS/TS、脚本工具、低代码引擎）中，开发者通常面临以下困境：

1.  **嵌套地狱 (Object Nesting)**：传统的 `h` 函数需要嵌套大量的对象 `{ class: '...', id: '...' }`，视觉噪音极大，括号对齐困难。
2.  **属性污染 (Prop Mutation)**：复用一个基础标签（如 `const btn = div.class('btn')`）时，后续的修改往往会意外污染原始定义。
3.  **心智负担 (Cognitive Load)**：在阅读代码时，属性定义、事件绑定与子节点嵌套混杂在一起，难以一眼看出 DOM 结构。
4.  **环境依赖 (Compilation)**：JSX 需要复杂的 Babel/SWC 编译配置，无法在轻量级脚本或原生浏览器环境中开箱即用。

**VanityH 通过“链式配置 + 终结符渲染”逻辑，完美化解了这些矛盾。**

---

## 🌟 核心优势：为什么选择 VanityH？

### 1. 结构对称美学 (Structural Elegance)

VanityH 将“属性配置”与“节点挂载”在语法层面上彻底分离。属性通过`.prop()`链式表达，而节点通过`()`包裹。这种视觉上的**括号对齐**，让代码结构与生成的 HTML 结构高度映射。

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

### 2. 绝对不可变架构 (Immutable Architecture)

基于 **Copy-on-Write (写时拷贝)** 哲学。当你调用一个属性时，VanityH 绝不修改当前对象，而是通过闭包产生一个全新的“状态快照”。

这确保了组件在解构和复用时的**绝对安全**：

```js
const baseBtn = button.class("btn");

const redBtn = baseBtn.style("color: red")("红色按钮");
const blueBtn = baseBtn.style("color: blue")("蓝色按钮"); // baseBtn 始终保持纯净
```

### 3. 零魔法、全透明 (Zero Magic)

我们坚持“工具不应比开发者更聪明”。VanityH 不会自动处理布尔值，不设隐式转换。它只是一个**高性能的搬运工**：你链式调用的每一个键值对，都会被原封不动地传递给底层的渲染函数。

### 4. 极致轻量与兼容

- **体积**：核心逻辑约 10 行代码，压缩后几乎不占体积。
- **兼容性**：支持 Vue, Preact, React (需要自定义 h), Snabbdom 等任何遵循 `h(tag, props, children)` 约定的框架。

---

## 🛠 技术实现原理

VanityH 内部利用了 JavaScript 的 **Proxy** 拦截 `get` 操作，并结合 **递归闭包** 来管理状态。

- **配置态**：访问属性时返回一个新的 Proxy，其内部闭包持有了累加后的 `props` 对象。
- **执行态**：当 Proxy 作为函数被调用时，它化身为“终结符”，将闭包内的 `props` 与当前传入的 `children`（自动执行 `flat(Infinity)`）一并提交给渲染引擎。

---

## 📦 安装与集成

```bash
npm install vanity-h
```

### 快速集成 (以 Vue 为例)

```typescript
import { h } from "vue";
import createVanity from "vanity-h";

// 1. 初始化（解构出你需要的标签）
const { x, div, p, span } = createVanity(h);

// 2. 包装自定义组件
import MyComp from "./MyComp.vue";

const UI = div.class("wrapper")(
  x(MyComp).theme("dark").onClose(handleClose)(), // 使用 x 包装器
  p.style("font-weight: bold")("VanityH 现已就绪"),
);
```

---

## ⌨️ 类型支持 (TypeScript)

VanityH 提供深度优化的 TS 类型推导

```typescript
import createVanity, { type VanityH } from "vanity-h";

// 强类型声明
const v: VanityH<VNode> = createVanity(h);
```

---

## 📄 开源协议

MIT License.

**VanityH**：让手写 Render 函数不再是痛苦，而是一种享受。
