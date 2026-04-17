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

```
src/
  index.ts    核心实现：Proxy + 闭包，Copy-on-Write，全局 $ getter
  vue.ts      Vue 3 适配层
  react.ts    React 适配层
  preact.ts   Preact 适配层
```

## `$` 属性

`$` 是 `x()` 的简写，允许任意组件直接链式调用：

```js
x(Demo).name('Tom').age(20)()
Demo.$.name('Tom').age(20)() // 等价
```

### 运行时实现

在 `createVanity` 调用时，通过 `Object.defineProperty` 在 `Object.prototype` 上注册全局 getter：

```typescript
Object.defineProperty(Object.prototype, '$', {
  get() {
    return createProxy(this.valueOf())
  },
})
```

所有框架适配层的 `defineComponent` **均为纯类型包装**，运行时原样返回组件，`$` 完全由全局 getter 处理。

### 为什么不在框架层赋值 `instance.$ = ...`

Vue 组件构造函数的原型链上有只读的 `$` getter（指向公共实例 `ComponentPublicInstance`），直接赋值会抛出：

```
TypeError: Cannot set property $ of #<Object> which has only a getter
```

Preact/React 同样不需要赋值，全局 getter 已能正确处理函数组件。

### 全局类型声明

```typescript
// index.ts — 默认 any，不做类型检查，框架层通过返回类型覆盖
declare global {
  interface Object {
    $: any
  }
}
```

TypeScript 接口属性无法访问 `this` 的具体类型，因此全局层面无法做精确推断，精确类型由各框架适配层的 `defineComponent` 提供。

## 各框架适配层

### Preact / React

`defineComponent` 纯类型包装，通过函数泛型推断 Props：

```typescript
export function defineComponent<T extends (props: any) => JSX.Element>(
  component: T,
): T & { $: PreactElementBuilder<ExtractComponentProps<T>> } {
  return component as any
}
```

用法：

```typescript
const Demo = defineComponent(({ name, age }: { name: string; age: number }) => {
  return div(name, age)
})

Demo.$.name('Tom').age(20)() // ✅ 精确类型检查
Demo.$.name(123)() // ❌ 类型错误
```

### Vue 3

镜像 Vue 原生 `defineComponent` 的 setup 重载，通过 `abstract new` 模式从 `$props` 提取 Props 和 Emits：

```typescript
// Props 提取原理：Vue 组件类型通过 $props 暴露
export type ExtractVueProps<T> = T extends abstract new (...args: any[]) => { $props: infer P }
  ? P : {}

// EmitsToProps：将 emits 对象转换为 onXxx 处理器类型，返回值统一为 any
export type EmitsToProps<T extends Record<string, (...args: any[]) => any>> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (...args: Parameters<T[K]>) => any
}

// WithDollar：根据 E 的形式选择精确路径或降级路径
type WithDollar<R, E extends EmitsOptions> = R & {
  $: VueComponentWithProps<
    E extends Record<string, (...args: any[]) => any>
      ? Omit<ExtractVueProps<R>, `on${string}`> & EmitsToProps<E>  // 对象写法：精确类型
      : ExtractVueProps<R>                                          // 数组写法：降级到 $props
  >
}

export function defineComponent<Props, E extends EmitsOptions, ...>(
  setup: ...,
  options?: { ..., emits?: E | EE[] },
): WithDollar<DefineSetupFnComponent<Props, E, S>, E> {
  return vueDefineComponent(setup as any, options as any) as any
}
```

用法（两种 emits 写法均支持）：

```typescript
// 数组写法：onSay 存在性有检查，参数类型为 any
const Demo = defineComponent((props: { name: string }) => () => div(props.name), {
  props: ['name'],
  emits: ['say'],
})
Demo.$.name('Tom').onSay(() => {})() // ✅

// 对象写法：onSay 参数类型精确推断
const Demo2 = defineComponent((props: { name: string }) => () => div(props.name), {
  props: ['name'],
  emits: { say: (word: string) => !!word },
})
Demo2.$.name('Tom').onSay((word) => console.log(word))() // ✅ word: string
```

## 类型系统关键决策

| 场景                       | 方案                                                        | 原因                                                  |
| -------------------------- | ----------------------------------------------------------- | ----------------------------------------------------- |
| 全局 `Object.$`            | `any`                                                       | TS 接口属性无法访问 `this` 的具体类型                 |
| Preact/React 组件 `$`      | `defineComponent` 纯类型包装                                | 函数泛型可推断 Props                                  |
| Vue 组件 `$`（数组 emits） | `ExtractVueProps<R>`（来自 `$props`）                       | `$props` 已包含 `onXxx`，参数为 `any`                 |
| Vue 组件 `$`（对象 emits） | `Omit<ExtractVueProps<R>, 'on${string}'> & EmitsToProps<E>` | `E` 携带精确参数类型，覆盖 `$props` 中的 `any` 版本   |
| Vue 内置组件 `$`           | 全局 `any`                                                  | 模块增强中无法使用 `this` 多态                        |
| `EmitsToProps` 返回值      | 统一为 `any`                                                | handler 返回值无意义，避免 validator 签名污染用户代码 |

## 懒加载组件

**Vue** — 直接使用原生 `defineAsyncComponent`，不需要包装：

- 异步组件 Props 类型无法从 loader 函数自动提取
- 懒加载场景通常不需要链式配置 props
- 需要传 props 时用 `$` 或 `x()`（走 `any`）

**Preact/React** — `lazy` 返回特殊类型，不符合 `defineComponent` 的约束 `T extends (props: any) => JSX.Element`，天然排除误用。

## 已知限制

- 未用 `defineComponent` 包装的 Preact/React 组件，`$` 无类型检查（走 `any`）
- Vue `defineComponent` 只支持 setup 函数重载，不支持纯 options 对象写法（`{ setup() {}, props: {...} }`）
- Vue 内置组件 `$` 无精确类型
- Vue 推荐统一用 setup 函数写法，`props: ['name']` 数组写法的类型提取依赖 Vue 内部的 `$props`，精度受限

## 工具链

```bash
vp pack        # 构建库
vp check       # 类型检查 + lint + 格式检查
vp fmt         # 格式化
vp test        # 运行测试
```
