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
// 等价写法
x(Demo).name('Tom').age(20)()
Demo.$.name('Tom').age(20)()
```

### 实现方式

运行时通过 `Object.defineProperty(Object.prototype, '$', { get() { return createProxy(this.valueOf()) } })` 实现。

类型系统中：

```typescript
// index.ts - 全局默认声明，不做类型检查
declare global {
  interface Object {
    $: any
  }
}
```

### 各框架的类型支持

**Preact / React**：通过 `defineComponent` 包装函数附加精确类型：

```typescript
// preact.ts / react.ts
export function defineComponent<T extends (props: any) => JSX.Element>(
  component: T,
): T & { $: PreactElementBuilder<ExtractComponentProps<T>> }
```

用法：

```typescript
const Demo = defineComponent(({ name, age }: PropsType) => { ... })
Demo.$.name('Tom').age(20)() // ✅ 有精确类型检查
```

**Vue**：通过镜像 Vue 原生 `defineComponent` 的 setup 重载，利用 `ExtractVueProps` 提取 Props：

```typescript
// vue.ts
export type ExtractVueProps<T> = T extends abstract new (...args: any[]) => { $props: infer P }
  ? P
  : {}

export function defineComponent<Props, E, EE, S>(
  setup: (props: Props, ctx: SetupContext<E, S>) => RenderFunction,
  options?: ...
): DefineSetupFnComponent<Props, E, S> & {
  $: VueComponentWithProps<ExtractVueProps<...> & Record<string, any>>
}
```

用法：

```typescript
const Demo = defineComponent((props: { name: string; age: number }) => { ... })
Demo.$.name('tom').age(20)() // ✅ 有精确类型检查
```

Vue 内置组件（`Transition` 等）走全局 `any`，可自由调用。

## 类型系统关键决策

| 场景                  | 方案                                  | 原因                                          |
| --------------------- | ------------------------------------- | --------------------------------------------- |
| 全局 `Object.$`       | `any`                                 | TypeScript 接口属性无法访问 `this` 的具体类型 |
| Preact/React 组件 `$` | `defineComponent` 包装                | 通过函数泛型推断 Props                        |
| Vue 组件 `$`          | 镜像 setup 重载 + `abstract new` 提取 | Vue 组件类型通过 `$props` 暴露                |
| Vue 内置组件 `$`      | 全局 `any`                            | 无法在模块增强中使用 `this` 多态              |

## 已知限制

- 不使用 `defineComponent` 包装的 Preact/React 组件，`$` 无类型检查（走 `any`）
- Vue 的 options API 写法（`props: ['name', 'age']`）类型提取不如 setup 函数写法精确
- Vue 内置组件的 `$` 无精确类型

## 工具链

- 构建：`vp pack`
- 类型检查 + lint：`vp check`
- 格式化：`vp fmt`
- 测试：`vp test`
