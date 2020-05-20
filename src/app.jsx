import { Logo } from './logo'
import { useCounter } from './useCounter'

export function App(props) {
  const [count, increment] = useCounter(1);
  return (
    <div>
      <Logo />
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  )
}
