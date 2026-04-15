import vanity, { defineComponent } from 'vanity-h/vue'
import { createApp, type EmitFn } from 'vue'

const { div, img } = vanity

type DemoPropsType = {
  name: string
  age: number
}

type DemoEmitsType = {
  run: () => void
  say: (word: string) => void
}

const Demo = defineComponent<DemoPropsType, DemoEmitsType>(
  (props: DemoPropsType, { emit }: { emit: EmitFn<DemoEmitsType> }) => {
    console.log(props)
    emit('run')
    emit('say', 'hi')
    return () => div.class('demo-class')('hello world')
  },
  {
    props: ['name', 'age'],
    emits: ['say'],
  },
)

const App = defineComponent(() => {
  return () =>
    div(
      div
        .class({ style_class: true })
        .style({ color: 'red' })
        .onclick(() => {})(),
      Demo.name('tom')
        .age(20)
        .onSay(() => {})
        .onRun(() => {})(),
      img.class(['image-class']).style('height:100%').src('source-url').alt('123')(),
    )
})

createApp(App()).mount('#app')
