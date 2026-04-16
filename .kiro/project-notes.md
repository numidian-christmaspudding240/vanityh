# VanityH 项目笔记

## 项目概述

VanityH 是一个极简的 Hyperscript DSL 构建器（186字节），将冗长的 `h(tag, props, children)` 调用转换为流畅的链式语法。

```js
// 传统写法
h('div', { class: 'card' }, [h('button', { onClick: fn }, 'Click')])

// VanityH 写法
div.class('card')(button.onClick(fn)('Click'))
```

## 核心架构

- `src/index.ts` - 核心实现，Proxy + 闭包，Copy-on-Write
- `src/vue.ts` - Vue 3 适配层
- `src/react.ts` - React 适配层
- `src/preact.ts` - Preact 适配层

## `$` 属性特性

最近引入的 `$` 属性，允许任意对象/组件直接链式调用，等价于 `x()` 包装：

```js
x(Demo).name('Tom').age(20)()
Demo.$.name('Tom').age(20)()  // 等价
```

### 运行时实现

```typescript
Object.defineProperty(Object.prototype, '$', {
  get() { return createProxy(this.valueOf()) }
})
```

### 类型系统

全局默认声明为 `any`，不做类型检查，框架层覆盖提供精确类型：

```typescript
declare global {
  interface Object { $: any }
}
```

### 各框架类型支持

**Preact / React** — `defineComponent` 包装，通过函数泛型推断 Props：

```typescript
export function defineComponent<T extends (props: any) => JSX.Element>(
  component: T,
): T & { $: PreactElementBuilder<ExtractComponentProps<T>> }

// 用法
const Demo = defineComponent(({ name, age }: PropsType) => { ... })
Demo.$.name('Tom').age(20)() // ✅ 精确类型检查
```

**Vue** — 镜像 Vue 原生 `defineComponent` 的 setup 重载，通过 `abstract new` 模式提取 `$props`：

```typescript
export type ExtractVueProps<T> = T extends abstract new (...args: any[]) => { $props: infer P }
  ? P : {}

export function defineComponent<Props, E, EE, S>(
  setup: (props: Props, ctx: SetupContext<E, S>) => RenderFunction,
  options?: ...
): DefineSetupFnComponent<Props, E, S> & {
  $: VueComponentWithProps<ExtractVueProps<...>>
}

// 用法
const Demo = defineComponent((props: { name: string; age: number }) => { ... })
Demo.$.name('tom').age(20)() // ✅ 精确类型检查
```

Vue 内置组件（`Transition` 等）走全局 `any`，可自由调用。

## 类型系统关键决策

| 场景 | 方案 | 原因 |
|------|------|------|
| 全局 `Object.$` | `any` | 接口属性无法访问 `this` 的具体类型，这是 TypeScript 的根本限制 |
| Preact/React 组件 `$` | `defineComponent` 包装 | 通过函数泛型推断 Props |
| Vue 组件 `$` | 镜像 setup 重载 + `abstract new` 提取 | Vue 组件类型通过 `$props` 暴露 |
| Vue 内置组件 `$` | 全局 `any` | 模块增强中无法使用 `this` 多态 |

## 懒加载组件

**Vue** — `defineAsyncComponent` 不需要包装，直接使用原生 API：
- 异步组件 Props 类型无法从 loader 函数自动提取
- 懒加载场景不需要链式配置 props
- 需要传 props 时用 `$` 或 `x()`（走 `any`）

```typescript
import { defineAsyncComponent } from 'vue'
const AsyncComp = defineAsyncComponent(() => import('./Heavy.vue'))
AsyncComp.$.someProp('value')() // 走 any，可用
```

**Preact/React** — `lazy` 返回特殊类型，不符合 `defineComponent` 的约束（`T extends (props: any) => JSX.Element`），天然排除误用。

## 已知限制

- 未用 `defineComponent` 包装的 Preact/React 组件，`$` 无类型检查
- Vue 推荐统一用 setup 函数写法，options API 写法（`props: ['name']`）类型提取不精确
- Vue 内置组件 `$` 无精确类型
- Vue `defineComponent` 只支持 setup 函数重载，不支持纯 options 对象写法

## 工具链

```bash
vp pack        # 构建
vp check       # 类型检查 + lint + 格式检查
vp fmt         # 格式化
vp test        # 测试
```
