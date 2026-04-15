import { render } from 'preact'
import vanity from 'vanity-h/preact'

const { x, div, main, img } = vanity

type PropsType = { name: string; age: number }

function Demo1({ name, age }: PropsType) {
  return div('demo2', name, age, img.src('ssss')())
}

const Demo2 = x(({ name, age }: PropsType) => div('demo2', name, age, img.src('ssss')()))

function App() {
  return div.className('div-class')(
    main(
      x(Demo1).name('Tom').age(20)(),
      Demo2.name('Tom').age(20)(),
      div.style({ color: 'red' })(),
    ),
  )
}

render(<App />, document.getElementById('app')!)
