import { useState, useRef } from 'react'

function App() {
  const [response, setResponse] = useState(null)
  const fileInputRef = useRef(null)

  const handleRequest = async (url, options = {}) => {
    try {
      const res = await fetch(url, options)
      let data
      if (!res.ok) {
        try {
          data = await res.json()
        } catch (jsonError) {
          const text = await res.text()
          data = { error: `Failed to parse JSON: ${text}` }
        }
      } else {
        try {
          data = await res.json()
        } catch (jsonError) {
          const text = await res.text()
          data = { error: `Failed to parse JSON: ${text}` }
        }
      }
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data
      })
    } catch (error) {
      setResponse({ error: error.message })
    }
  }

  const handleUpload = (fail = false) => {
    const file = fileInputRef.current.files[0]
    if (!file) {
      setResponse({ status: 400, statusText: 'Bad Request', data: { error: 'No file selected' } })
      return
    }
    const formData = new FormData()
    formData.append('file', file)
    handleRequest(fail ? '/api/upload/fail' : '/api/upload', {
      method: 'POST',
      body: formData
    })
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>CRUD & Error Testing with MSW</h1>

      {/* 分頁查詢 */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => handleRequest('/api/users?page=1&limit=2')}
          style={{ marginRight: '10px' }}
        >
          Get Users (Page 1, Limit 2)
        </button>
      </div>

      {/* 單筆查詢 */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => handleRequest('/api/users/1')}
          style={{ marginRight: '10px' }}
        >
          Get User by ID (1)
        </button>
        <button
          onClick={() => handleRequest('/api/users/999')}
          style={{ marginRight: '10px' }}
        >
          Get User by ID (999, 404)
        </button>
      </div>

      {/* 創建 */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() =>
            handleRequest('/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: 'Eve', email: 'eve@example.com' })
            })
          }
          style={{ marginRight: '10px' }}
        >
          Create User
        </button>
        <button
          onClick={() =>
            handleRequest('/api/users/fail', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({})
            })
          }
          style={{ marginRight: '10px' }}
        >
          Create User (Fail, 400)
        </button>
        <button
          onClick={() =>
            handleRequest('/api/users/conflict', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: 'Eve', email: 'alice@example.com' })
            })
          }
          style={{ marginRight: '10px' }}
        >
          Create User (Conflict, 409)
        </button>
      </div>

      {/* 更新 */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() =>
            handleRequest('/api/users/1', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: 'Alice Updated', email: 'alice.updated@example.com' })
            })
          }
          style={{ marginRight: '10px' }}
        >
          Update User (ID 1)
        </button>
        <button
          onClick={() =>
            handleRequest('/api/users/999/fail', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: 'Invalid', email: 'invalid@example.com' })
            })
          }
          style={{ marginRight: '10px' }}
        >
          Update User (ID 999, 404)
        </button>
        <button
          onClick={() =>
            handleRequest('/api/users/1/fail', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({})
            })
          }
          style={{ marginRight: '10px' }}
        >
          Update User (ID 1, 400)
        </button>
      </div>

      {/* 刪除 */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() =>
            handleRequest('/api/users/2', {
              method: 'DELETE'
            })
          }
          style={{ marginRight: '10px' }}
        >
          Delete User (ID 2)
        </button>
        <button
          onClick={() =>
            handleRequest('/api/users/999/fail', {
              method: 'DELETE'
            })
          }
          style={{ marginRight: '10px' }}
        >
          Delete User (ID 999, 404)
        </button>
      </div>

      {/* 檔案上傳 */}
      <div style={{ marginBottom: '20px' }}>
        <input type="file" ref={fileInputRef} style={{ marginRight: '10px' }} />
        <button onClick={() => handleUpload(false)} style={{ marginRight: '10px' }}>
          Upload File
        </button>
        <button onClick={() => handleUpload(true)} style={{ marginRight: '10px' }}>
          Upload File (Fail, 500)
        </button>
      </div>

      {/* 錯誤測試 */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => handleRequest('/api/not-found')}
          style={{ marginRight: '10px' }}
        >
          Test 404 (Not Found)
        </button>
        <button
          onClick={() => handleRequest('/api/server-error')}
          style={{ marginRight: '10px' }}
        >
          Test 500 (Server Error)
        </button>
        <button
          onClick={() =>
            handleRequest('/api/bad-request', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({})
            })
          }
          style={{ marginRight: '10px' }}
        >
          Test 400 (Bad Request)
        </button>
        <button
          onClick={() => handleRequest('/api/unauthorized')}
          style={{ marginRight: '10px' }}
        >
          Test 401 (Unauthorized)
        </button>
      </div>

      {/* 顯示回應 */}
      {response && (
        <div>
          <h3>Response:</h3>
          <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default App