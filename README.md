```bash
npm install msw --save-dev

npx msw init public/ --save
// 在 `public` 資料夾中生成 `mockServiceWorker.js`。
```
```js
// src/mocks/handlers.js
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/user', () => {
    return HttpResponse.json({ name: 'John Maverick' })
  })
]

// src/mocks/browser.js for Browser
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

// src/mocks/server.js for Node.js
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

```js
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  const { worker } = await import('./mocks/browser')
  await worker.start()
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})
```

```js
// src/App.jsx
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
```


```bash
# test run
npm run dev
```
---
Display
```
Vite + React + MSW Template (JavaScript)
User: John Maverick
```

