import { useEffect, useState } from 'react'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => setUser(data.name))
  }, [])

  return (
    <div>
      <h1>Vite + React + MSW Template (JavaScript)</h1>
      <p>User: {user || 'Loading...'}</p>
    </div>
  )
}

export default App