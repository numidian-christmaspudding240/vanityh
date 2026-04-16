<h1 align="center">
  VanityH
  <a href="https://www.npmjs.com/package/vanity-h"><img src="https://img.shields.io/npm/v/vanity-h.svg?style=flat" alt="npm version"></a>
</h1>

[简体中文](./README_zh.md)

### 🚀 VanityH: Make Hyperscript Elegant

**Say goodbye to nesting hell, embrace fluent development experience**

VanityH is not just another complex UI framework. It's a minimal **DSL (Domain-Specific Language) builder**. Using Proxy and closure logic, it transforms verbose `h(tag, props, children)` calls into a fluent, chainable syntax similar to **SwiftUI** or **Flutter**.

---

### 🎯 Core Problems VanityH Solves

In non-JSX environments (vanilla JS/TS, scripting tools, low-code engines), developers face these challenges:

- **Nesting Hell**: Traditional `h` functions require heavy object nesting, creating visual noise
- **Prop Mutation**: Component reuse often accidentally pollutes original definitions
- **Cognitive Load**: Properties, events, and child nodes are interleaved, making DOM structure hard to understand
- **Environment Dependencies**: JSX requires compilation setup, not suitable for lightweight use in native browser environments

**VanityH perfectly resolves these issues with "chainable configuration + terminator rendering" logic.**

---

### ✨ Why Choose VanityH?

#### 🎨 Structural Elegance

VanityH separates property configuration from node mounting syntax, creating perfect mapping between code structure and DOM structure.

```js
html.lang('en')(
  head(
    meta.charset('UTF-8')(),
    link.rel('icon').type('image/svg+xml').href('/favicon.svg')(),
    title('VanityH – Elegance Redefined'),
  ),
  body(div.id('app')(), script.type('module').src('/src/main.ts')()),
)
```

#### 🔒 Fully Immutable Architecture

Based on **Copy-on-Write** philosophy, each property call produces a brand-new state snapshot.

```js
const baseBtn = button.class('btn')

const redBtn = baseBtn.style('color: red')('Red Button')
const blueBtn = baseBtn.style('color: blue')('Blue Button') // baseBtn remains pure
```

#### 🔍 Zero Magic Design

Tools should not be smarter than developers. VanityH doesn't auto-handle booleans, no implicit conversions, fully transparent.

#### 📦 Ultra-Lightweight & Compatible

- **Size**: Just 186 bytes, ultra-minimal implementation
- **Compatibility**: Supports Vue, Preact, React, Snabbdom, and any hyperscript-compatible renderer

---

### 🚀 Quick Start

#### Installation

**NPM:**

```bash
npm install vanity-h
```

**CDN (No Build Step Required):**

```html
<script type="module">
  import { render, h } from 'https://esm.sh/preact'
  import createVanity from 'https://esm.sh/vanity-h'

  const { div, span } = createVanity(h)

  const app = () => div.class('app')(span('Hello World'))
  render(app(), document.getElementById('app'))
</script>
```

#### Traditional vs VanityH Syntax

```js
// Traditional hyperscript
h('div', { class: 'card', style: 'padding: 20px' }, [
  h('button', { class: 'btn-primary', onClick: handleClick }, 'Click me'),
])

// VanityH syntax
div.class('card').style('padding: 20px')(
  button.class('btn-primary').onClick(handleClick)('Click me'),
)
```

---

### 🔧 Framework Adapters

VanityH ships with first-class adapters for Vue, React, and Preact with full TypeScript support.

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
      MyComp.$.name('Tom').age(20).onSay((word) => console.log(word))(), // ✅ typed
      MyComp.$.name(123)(), // ❌ type error: number not assignable to string
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

// $ provides typed prop chaining
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

### ✨ The `$` Property

The `$` property is a shorthand equivalent to `x()` — it wraps any component for typed prop chaining:

```typescript
// These are equivalent
x(MyComp).name('Tom').age(20)()
MyComp.$.name('Tom').age(20)()
```

`$` is implemented as a global `Object.prototype` getter at runtime. Framework adapters' `defineComponent` is **purely a type-level wrapper** — it returns the component as-is with no runtime overhead. The global getter handles everything at runtime.

When using framework adapters with `defineComponent`, `$` carries full prop type inference. On components not wrapped with `defineComponent` (e.g. Vue built-ins like `Transition`), `$` is untyped but still callable:

```typescript
import { Transition } from 'vue'
Transition.$.name('fade')() // works, untyped
```

---

### 🛠 Technical Implementation

VanityH internally uses JavaScript's **Proxy** to intercept `get` operations, combined with **recursive closures** to manage state:

- **Configuration Mode**: Accessing properties returns a new Proxy with internal closure holding accumulated `props` object
- **Execution Mode**: When Proxy is called as function, it submits `props` and `children` to the renderer

---

### 🔧 TypeScript Support

```typescript
import createVanity, { type VanityH } from 'vanity-h'
import { h, type VNode } from 'vue'

const v: VanityH<VNode> = createVanity(h)

const element = v.div.class('test').id('app')('Content')
```

Framework adapters provide deeper type inference — see [Framework Adapters](#-framework-adapters) above.

---

### 📊 Performance

- **Size**: 186 bytes (minified) / ~150 bytes (gzipped)
- **Zero Dependencies**: Pure JavaScript implementation
- **High Performance**: Proxy interception overhead is negligible
- **Memory Friendly**: Closure-based immutable design

---

### 🤝 Contributing

#### Development Setup

```bash
git clone https://github.com/VanityH/vanityh.git
cd vanityh
vp install       # install dependencies
vp check         # type check + lint
vp test          # run tests
vp pack          # build library
```

---

### 📄 License

MIT License © 2026 VanityH Team

**VanityH**: Make writing render functions a pleasure, not a pain.

---

### 🙏 Acknowledgments

- [HTM](https://github.com/developit/htm) - JSX-like syntax in plain JavaScript
- [DLight](https://github.com/dlight-js/dlight) - DX-first UI rendering library
- [Hyperscript](https://github.com/hyperhype/hyperscript) - Create HTML with JavaScript
- [SwiftUI](https://developer.apple.com/swiftui) - Declarative UI framework
