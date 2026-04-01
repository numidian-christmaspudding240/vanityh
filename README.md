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
html.lang("en")(
  head(
    meta.charset("UTF-8")(),
    link.rel("icon").type("image/svg+xml").href("/favicon.svg")(),
    title("VanityH – Elegance Redefined"),
  ),
  body(div.id("app")(), script.type("module").src("/src/main.ts")()),
);
```

#### 🔒 Fully Immutable Architecture

Based on **Copy-on-Write** philosophy, each property call produces a brand-new state snapshot.

```js
const baseBtn = button.class("btn");

const redBtn = baseBtn.style("color: red")("Red Button");
const blueBtn = baseBtn.style("color: blue")("Blue Button"); // baseBtn remains pure
```

#### 🔍 Zero Magic Design

Tools should not be smarter than developers. VanityH doesn't auto-handle booleans, no implicit conversions, fully transparent.

#### 📦 Ultra-Lightweight & Compatible

- **Size**: Core logic ~10 lines of code, nearly negligible when minified
- **Compatibility**: Supports Vue, Preact, React, Snabbdom, and any hyperscript-compatible renderer

---

### 🚀 Quick Start

#### Installation

```bash
npm install vanity-h
```

#### Basic Usage (Vue 3)

```typescript
import { h } from "vue";
import createVanity from "vanity-h";

// Initialize and destructure needed tags
const { x, div, button, span, h1 } = createVanity(h);

// 2. Wrap custom components
import MyComp from "./MyComp.vue";

// Create UI
const app = div.class("app").style("padding: 20px")(
  h1("VanityH Demo"),
  x(MyComp).theme("dark").onClose(handleClose)(), // Use x wrapper
  button.onClick(() => alert("Hello!"))("Click Me"),
  span.style("color: blue")("Experience elegant chaining"),
);
```

#### Try it in Playground

Experience VanityH instantly in your browser:

[![Try in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/vitejs-vite-bujruupx)

#### Traditional vs VanityH Syntax

```js
// Traditional hyperscript
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

// VanityH syntax
div.class("card").style("padding: 20px")(
  button.class("btn-primary").onClick(handleClick)("Click me"),
);
```

---

### 🛠 Technical Implementation

VanityH internally uses JavaScript's **Proxy** to intercept `get` operations, combined with **recursive closures** to manage state:

- **Configuration Mode**: Accessing properties returns a new Proxy with internal closure holding accumulated `props` object
- **Execution Mode**: When Proxy is called as function, it submits `props` and `children` to the renderer

---

### 🔧 TypeScript Support

VanityH provides deeply optimized type inference:

```typescript
import createVanity, { type VanityH } from "vanity-h";
import { h, VNode } from "vue";

// Strongly typed
const v: VanityH<VNode> = createVanity(h);

// Type checking
const element = v.div.class("test").id("app")("Content");
```

---

### 📊 Performance

- **Size**: ~600 bytes (gzipped)
- **Zero Dependencies**: Pure JavaScript implementation
- **High Performance**: Proxy interception overhead is negligible
- **Memory Friendly**: Closure-based immutable design

---

### 🤝 Contributing

We welcome all forms of contributions!

#### Development Setup

```bash
git clone https://github.com/VanityH/vanityh.git
cd vanityh
npm install
npm run dev  # Start development server
```

---

### 📄 License

MIT License © 2026 VanityH Team

**VanityH**: Make writing render functions a pleasure, not a pain.

---

### 🙏 Acknowledgments

Thanks to these projects for inspiring VanityH:

- [HTM](https://github.com/developit/htm) - JSX-like syntax in plain JavaScript
- [DLight](https://dlight.dev) - DX-first UI rendering library
- [Hyperscript](https://github.com/hyperhype/hyperscript) - Create HTML with JavaScript
- [SwiftUI](https://developer.apple.com/xcode/swiftui/) - Declarative UI framework

Special thanks to all developers contributing to the open source community!
