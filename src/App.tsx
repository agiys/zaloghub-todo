import { useEffect, useState } from 'react'
import './App.css'

type Todo = { id: string; text: string; done: boolean }
type Filter = 'all' | 'active' | 'done'

const STORAGE_KEY = 'todos'

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Todo[]) : []
  } catch {
    return []
  }
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'active', label: 'Активные' },
  { key: 'done', label: 'Выполненные' },
]

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [text, setText] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [removing, setRemoving] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    const value = text.trim()
    if (!value) return
    setTodos([...todos, { id: crypto.randomUUID(), text: value, done: false }])
    setText('')
  }

  const toggle = (id: string) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const remove = (id: string) => {
    setRemoving(id)
    setTimeout(() => {
      setTodos((prev) => prev.filter((t) => t.id !== id))
      setRemoving(null)
    }, 200)
  }

  const visible = todos.filter((t) =>
    filter === 'all' ? true : filter === 'done' ? t.done : !t.done,
  )

  return (
    <main className="app">
      <h1>Список задач</h1>
      <form className="add" onSubmit={add}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Новая задача"
          aria-label="Новая задача"
        />
        <button type="submit" disabled={!text.trim()}>
          Добавить
        </button>
      </form>

      <div className="filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={filter === f.key ? 'active' : ''}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="empty">Задач нет</p>
      ) : (
        <ul>
          {visible.map((t) => (
            <li key={t.id} className={`${t.done ? 'done' : ''} ${removing === t.id ? 'removing' : ''}`}>
              <label>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggle(t.id)}
                />
                <span>{t.text}</span>
              </label>
              <button
                className="remove"
                onClick={() => remove(t.id)}
                aria-label="Удалить задачу"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
