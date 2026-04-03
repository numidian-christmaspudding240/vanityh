/**
 * VanityH – Elegant Hyperscript DSL for Frontend Render Functions
 */

/** 链式构建器：支持属性累加与最终渲染调用 */
export type ElementBuilder<VNode> = {
  /** 终结符：接收子节点并执行渲染 */
  (...children: any[]): VNode;
  /** 属性设置器：返回携带新 Props 的克隆实例 */
  [prop: string]: (value?: any) => ElementBuilder<VNode>;
};

/** 标签工厂：解构出的标签函数（如 div, span） */
export type TagFactory<VNode> = {
  (...children: any[]): VNode;
  [prop: string]: (value?: any) => ElementBuilder<VNode>;
};

/** VanityH 根对象：支持 x 包装器与动态标签索引 */
export type VanityH<VNode> = {
  /** 包装自定义组件：x(Component).props(val)() */
  x: <T>(Component: T) => TagFactory<VNode>;
} & {
  [tag: string]: TagFactory<VNode>;
};

/**
 * 创建 VanityH 实例
 * @param h 底层渲染函数 (Vue, Preact 等)
 */
export default function createVanity<
  H extends (tag: any, props: any, ...children: any[]) => any,
  VNode = ReturnType<H>,
>(h: H): VanityH<VNode> {
  /** 递归 Proxy：利用闭包实现 Immutable 状态管理 */
  const createProxy = (tag: any, props: Record<string, any> = {}): ElementBuilder<VNode> => {
    /** 渲染执行函数：合并当前闭包 props 与子节点 */
    const fn = (...children: any[]): VNode => h(tag, { ...props }, ...children.flat(Infinity));

    return new Proxy(fn as any, {
      // 写时拷贝：产生包含新属性的作用域分身
      get: (_, prop: string) => (value?: any) => createProxy(tag, { ...props, [prop]: value }),
    }) as ElementBuilder<VNode>;
  };

  /** 根代理：拦截 x 指令或标准 HTML 标签 */
  return new Proxy({} as any, {
    get: (_, tag: string) =>
      tag === "x" ? (Component: any) => createProxy(Component) : createProxy(tag),
  }) as VanityH<VNode>;
}
