import { render } from 'preact'
import { Logo } from './logo'
import './index.css'

function App(props) {
  return (
    <div>
      <Logo />
      <p>Hello Vite + Preact!</p>
      <p>
        <a
          class="link"
          href="https://preactjs.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Preact the right way ma
        </a>
      </p>
    </div>
  )
}

render(<App />, document.getElementById('app'))
