import {
  h,
  defineComponent as vueDefineComponent,
  defineAsyncComponent as vueDefineAsyncComponent,
} from 'vue'
import type { VNode, Ref, ClassValue, StyleValue } from 'vue'

import { createVanity, type VanityH, type ElementBuilder } from './index.ts'

type HtmlTags = {
  [K in keyof HTMLElementTagNameMap]: HTMLElementTagNameMap[K]
}

type VueBaseProps = {
  class?: ClassValue
  style?: StyleValue
  key?: string | number
  ref?: Ref<any> | string
}

type VueElements = {
  [K in keyof HtmlTags]: Omit<HtmlTags[K], 'style'> & VueBaseProps
}

export type VueComponentWithProps<Props extends Record<string, any> = {}> = ElementBuilder<
  Props & VueBaseProps,
  VNode,
  string | number | boolean | VNode | null | undefined
>

export type EmitsToProps<T extends Record<string, (...args: any[]) => any>> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: T[K]
}

export type VueVanityH = VanityH<
  VNode,
  string | number | boolean | VNode | null | undefined,
  VueElements
>

export const vanity = createVanity(h) as unknown as VueVanityH
export default vanity

export function defineComponent<
  Props extends Record<string, any> = {},
  Emits extends Record<string, (...args: any[]) => any> = {},
>(...args: any[]): VueComponentWithProps<Props & EmitsToProps<Emits>> {
  const instance = vueDefineComponent(...(args as [any]))
  instance.$ = vanity.x<Props & EmitsToProps<Emits>>(instance)
  return instance
}

export function defineAsyncComponent<Props extends Record<string, any> = {}>(
  ...args: Parameters<typeof vueDefineAsyncComponent>
): VueComponentWithProps<Props> {
  return vanity.x<Props>(vueDefineAsyncComponent(...args))
}
