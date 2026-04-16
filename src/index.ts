export type ExtractComponentProps<T> = T extends (props: infer P) => any ? P : {}

type UniversalChild = unknown

export type ElementBuilder<Props, VNode, Child = UniversalChild> = ((
  ...children: Child[]
) => VNode) & {
  [K in keyof Props]-?: (value: Props[K]) => ElementBuilder<Props, VNode, Child>
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export interface Callable extends Function {
  (...args: any[]): any
  [key: string]: any
}

export type VanityH<
  VNode,
  Child = UniversalChild,
  HtmlElements = Record<string, Record<string, any>>,
> = {
  x: {
    <Component>(
      Component: Component,
    ): ElementBuilder<ExtractComponentProps<Component>, VNode, Child>
    <Props extends Record<string, any> = Record<string, any>>(
      Component: any,
    ): ElementBuilder<Props, VNode, Child>
  }
} & {
  [Tag in keyof HtmlElements]: ElementBuilder<HtmlElements[Tag], VNode, Child>
}

export default createVanity
export function createVanity<
  H extends (tag: any, props: any, ...children: any[]) => any,
  VNode = ReturnType<H>,
>(h: H): VanityH<VNode> {
  const createProxy = (tag: any, props: Record<string, any> = {}): ElementBuilder<any, VNode> => {
    const fn = (...children: any[]) => h(tag, { ...props }, ...children.flat(Infinity))
    return new Proxy(fn as any, {
      get: (_, prop: string) => (value?: any) => createProxy(tag, { ...props, [prop]: value }),
    })
  }

  Object.defineProperty(Object.prototype, '$', {
    get() {
      return createProxy(this.valueOf())
    },
  })

  return new Proxy({} as any, {
    get: (_, tag: string) => (tag === 'x' ? (c: any) => createProxy(c) : createProxy(tag)),
  }) as VanityH<VNode>
}

declare global {
  interface Object {
    $: any
  }
}
