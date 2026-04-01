# VanityH

[简体中文](./README_zh.md)

**An Ultra-Lightweight, Immutable Streaming Rendering Factory (Fluent Hyperscript Factory)**

VanityH is not just another complex UI framework. It is a minimal **DSL (Domain-Specific Language) builder**. Using Proxy and closure logic, it transforms tedious `h(tag, props, children)` calls into a highly rhythmic, fluent development experience similar to **SwiftUI** or **Flutter**.

---

## ⚡️ Core Pain Points: What It Solves

In non-JSX environments (such as vanilla JS/TS, scripting tools, low-code engines), developers commonly face these issues:

1. **Nesting Hell (Object Nesting)**: Traditional `h` functions require heavy nesting of objects like `{ class: '...', id: '...' }`, creating excessive visual noise and difficult bracket alignment.
2. **Prop Mutation**: When reusing a base element (e.g., `const btn = div.class('btn')`), subsequent modifications often accidentally pollute the original definition.
3. **Cognitive Load**: Property definitions, event bindings, and child node nesting are interleaved, making it hard to visualize the DOM structure at a glance.
4. **Environment Dependencies (Compilation)**: JSX requires complex Babel/SWC setup and cannot be used out of the box in lightweight scripts or native browser environments.

**VanityH resolves these conflicts perfectly with “chainable configuration + terminator rendering” logic.**

---

## 🌟 Key Advantages: Why VanityH?

### 1. Structural Elegance

VanityH cleanly separates “property configuration” from “node mounting” at the syntax level. Properties are expressed via chained `.prop()` calls, while child nodes are wrapped in `()`. This visual **bracket symmetry** creates a near-perfect mapping between code structure and the resulting HTML structure.

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

### 2. Fully Immutable Architecture

Built around the philosophy of **Copy-on-Write**. When you call a property method, VanityH never mutates the current object. Instead, it produces a brand-new “state snapshot” via closure.

This guarantees **absolute safety** when destructuring and reusing components:

```js
const baseBtn = button.class("btn");

const redBtn = baseBtn.style("color: red")("Red Button");
const blueBtn = baseBtn.style("color: blue")("Blue Button"); // baseBtn remains pure
```

### 3. Zero Magic, Full Transparency

We stand by the principle: _tools should not be smarter than developers_. VanityH does not auto-handle booleans or perform implicit conversions. It acts only as a **high-performance translator**: every chained key-value pair is passed exactly as-is to the underlying renderer.

### 4. Ultra-Lightweight & Compatible

- **Size**: Core logic in ~10 lines of code, nearly negligible when minified.
- **Compatibility**: Works with Vue, Preact, React (with custom h), Snabbdom, and any framework following the `h(tag, props, children)` convention.

---

## 🛠 Technical Implementation

Internally, VanityH uses JavaScript’s **Proxy** to intercept `get` operations, paired with **recursive closures** to manage state.

- **Configuration Mode**: Accessing a property returns a new Proxy whose internal closure holds the accumulated `props` object.
- **Execution Mode**: When the Proxy is invoked as a function, it acts as a “terminator”, passing the closure-held `props` and incoming `children` (automatically flattened with `flat(Infinity)`) to the rendering engine.

---

## 📦 Installation & Integration

```bash
npm install vanity-h
```

### Quick Start (Vue Example)

```typescript
import { h } from "vue";
import createVanity from "vanity-h";

// 1. Initialize (destructure tags you need)
const { x, div, p, span } = createVanity(h);

// 2. Wrap custom components
import MyComp from "./MyComp.vue";

const UI = div.class("wrapper")(
  x(MyComp).theme("dark").onClose(handleClose)(), // Use x wrapper
  p.style("font-weight: bold")("VanityH is ready"),
);
```

---

## ⌨️ TypeScript Support

VanityH provides fully optimized TypeScript type inference.

```typescript
import createVanity, { type VanityH } from "vanity-h";

// Strongly typed
const v: VanityH<VNode> = createVanity(h);
```

---

## 📄 License

MIT License.

**VanityH**: Make writing render functions a pleasure, not a pain.
