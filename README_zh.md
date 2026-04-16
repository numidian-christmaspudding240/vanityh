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
html.lang('en')(
  head(
    meta.charset('UTF-8')(),
    link.rel('icon').type('image/svg+xml').href('/favicon.svg')(),
    title('VanityH - 极致优雅'),
  ),
  body(div.id('app')(), script.type('module').src('/src/main.ts')()),
)
```

#### 🔒 绝对不可变架构

基于**写时拷贝**哲学，每次属性调用都产生全新状态快照。

```js
const baseBtn = button.class('btn')

const redBtn = baseBtn.style('color: red')('红色按钮')
const blueBtn = baseBtn.style('color: blue')('蓝色按钮') // baseBtn 保持纯净
```

#### 🔍 零魔法设计

工具不应比开发者更聪明。VanityH 不自动处理布尔值，不设隐式转换，完全透明。

#### 📦 极致轻量与兼容

- **体积**：仅 186 字节，极致精简的实现
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
  import { render, h } from 'https://esm.sh/preact'
  import createVanity from 'https://esm.sh/vanity-h'

  const { div, span } = createVanity(h)

  const app = () => div.class('app')(span('Hello World'))
  render(app(), document.getElementById('app'))
</script>
```

#### 传统写法 vs VanityH

```js
// 传统 hyperscript 写法
h('div', { class: 'card', style: 'padding: 20px' }, [
  h('button', { class: 'btn-primary', onClick: handleClick }, 'Click me'),
])

// VanityH 写法
div.class('card').style('padding: 20px')(
  button.class('btn-primary').onClick(handleClick)('Click me'),
)
```

---

### 🔧 框架适配层

VanityH 为 Vue、React 和 Preact 提供一流的适配层，支持完整的 TypeScript 类型推断。

#### Vue 3

```typescript
import vanity, { defineComponent } from 'vanity-h/vue'
import { createApp, type EmitFn } from 'vue'

const { div } = vanity

type MyEmits = { say: (word: string) => void }

const MyComp = defineComponent(
  (props: { name: string; age: number }, { emit }: { emit: EmitFn<MyEmits> }) => {
    return () => div.class('demo')(props.name, props.age)
  },
  { props: ['name', 'age'], emits: ['say'] },
)

const App = defineComponent(() => {
  return () =>
    div(
      MyComp.$.name('Tom').age(20).onSay((word) => console.log(word))(), // ✅ 类型正确
      MyComp.$.name(123)(), // ❌ 类型错误：number 不能赋值给 string
    )
})

createApp(App).mount('#app')
```

#### React

```typescript
import vanity, { defineComponent } from 'vanity-h/react'

const { div } = vanity

const MyComp = defineComponent(({ name, age }: { name: string; age: number }) => {
  return div(name, age)
})

// $ 提供类型化的属性链式调用
MyComp.$.name('Tom').age(20)() // ✅
```

#### Preact

```typescript
import vanity, { defineComponent } from 'vanity-h/preact'

const { div } = vanity

const MyComp = defineComponent(({ name }: { name: string }) => {
  return div(name)
})

MyComp.$.name('Tom')() // ✅
```

---

### ✨ `$` 属性

`$` 属性是 `x()` 的简写，等价于用 `x()` 包装组件进行类型化链式调用：

```typescript
// 以下两种写法完全等价
x(MyComp).name('Tom').age(20)()
MyComp.$.name('Tom').age(20)()
```

`$` 在运行时通过全局 `Object.prototype` getter 实现。框架适配层的 `defineComponent` 是**纯类型层面的包装**，运行时原样返回组件，不添加任何额外逻辑，`$` 完全由全局 getter 处理。

通过框架适配层的 `defineComponent` 包装后，`$` 具有完整的 Props 类型推断。对于未经 `defineComponent` 包装的组件（如 Vue 内置的 `Transition`），`$` 无类型检查但仍可调用：

```typescript
import { Transition } from 'vue'
Transition.$.name('fade')() // 可用，无类型检查
```

---

### 🛠 实现原理

VanityH 内部利用 JavaScript 的 **Proxy** 拦截 `get` 操作，结合**递归闭包**管理状态：

- **配置态**：访问属性时返回新 Proxy，内部闭包持有累加的 `props` 对象
- **执行态**：Proxy 作为函数调用时，将 `props` 和 `children` 提交给渲染引擎

---

### 🔧 TypeScript 支持

```typescript
import createVanity, { type VanityH } from 'vanity-h'
import { h, type VNode } from 'vue'

const v: VanityH<VNode> = createVanity(h)

const element = v.div.class('test').id('app')('内容')
```

框架适配层提供更深层的类型推断，详见上方[框架适配层](#-框架适配层)章节。

---

### 📊 性能表现

- **体积**: 186 字节（压缩后）/ ~150 字节（gzip）
- **零依赖**: 纯 JavaScript 实现
- **高性能**: Proxy 拦截开销几乎可忽略
- **内存友好**: 基于闭包的不可变设计

---

### 🤝 贡献指南

#### 开发环境设置

```bash
git clone https://github.com/VanityH/vanityh.git
cd vanityh
vp install       # 安装依赖
vp check         # 类型检查 + lint
vp test          # 运行测试
vp pack          # 构建库
```

---

### 📄 开源协议

MIT License © 2026 VanityH Team

**VanityH**：让手写 Render 函数不再是痛苦，而是一种享受。

---

### 🙏 致谢

- [HTM](https://github.com/developit/htm) - JSX 语法的替代方案
- [DLight](https://github.com/dlight-js/dlight) - DX-first 的 UI 渲染库
- [Hyperscript](https://github.com/hyperhype/hyperscript) - 创建 HTML 的 JavaScript
- [SwiftUI](https://developer.apple.com/swiftui) - 声明式 UI 框架
