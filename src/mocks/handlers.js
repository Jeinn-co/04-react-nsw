import { http, HttpResponse } from 'msw'

// 模擬資料
const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
  { id: 4, name: 'David', email: 'david@example.com' },
]

export const handlers = [
  // 分頁查詢 (GET /api/users?page=1&limit=2)
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '2')
    const start = (page - 1) * limit
    const paginatedUsers = users.slice(start, start + limit)
    return HttpResponse.json({
      users: paginatedUsers,
      total: users.length,
      page,
      limit
    })
  }),

  // 單筆查詢 (GET /api/users/:id)
  http.get('/api/users/:id', ({ params }) => {
    const id = parseInt(params.id)
    const user = users.find((u) => u.id === id)
    if (!user) {
      return new HttpResponse(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, statusText: 'Not Found', headers: { 'Content-Type': 'application/json' } }
      )
    }
    return HttpResponse.json(user)
  }),

  // 創建 (POST /api/users)
  http.post('/api/users', async ({ request }) => {
    const newUser = await request.json()
    if (!newUser.name || !newUser.email) {
      return new HttpResponse(
        JSON.stringify({ error: 'Name and email are required' }),
        { status: 400, statusText: 'Bad Request', headers: { 'Content-Type': 'application/json' } }
      )
    }
    if (users.some((u) => u.email === newUser.email)) {
      return new HttpResponse(
        JSON.stringify({ error: 'Email already exists' }),
        { status: 409, statusText: 'Conflict', headers: { 'Content-Type': 'application/json' } }
      )
    }
    const user = { id: users.length + 1, ...newUser }
    users.push(user)
    return HttpResponse.json(user, { status: 201 })
  }),

  // 模擬創建失敗 (POST /api/users/fail)
  http.post('/api/users/fail', () => {
    return new HttpResponse(
      JSON.stringify({ error: 'Name and email are required' }),
      { status: 400, statusText: 'Bad Request', headers: { 'Content-Type': 'application/json' } }
    )
  }),

  // 模擬創建衝突 (POST /api/users/conflict)
  http.post('/api/users/conflict', async ({ request }) => {
    const newUser = await request.json()
    if (!newUser.name || !newUser.email) {
      return new HttpResponse(
        JSON.stringify({ error: 'Name and email are required' }),
        { status: 400, statusText: 'Bad Request', headers: { 'Content-Type': 'application/json' } }
      )
    }
    return new HttpResponse(
      JSON.stringify({ error: 'Email already exists' }),
      { status: 409, statusText: 'Conflict', headers: { 'Content-Type': 'application/json' } }
    )
  }),

  // 更新 (PUT /api/users/:id)
  http.put('/api/users/:id', async ({ params, request }) => {
    const id = parseInt(params.id)
    const updates = await request.json()
    const userIndex = users.findIndex((u) => u.id === id)
    if (userIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, statusText: 'Not Found', headers: { 'Content-Type': 'application/json' } }
      )
    }
    if (!updates.name || !updates.email) {
      return new HttpResponse(
        JSON.stringify({ error: 'Name and email are required' }),
        { status: 400, statusText: 'Bad Request', headers: { 'Content-Type': 'application/json' } }
      )
    }
    users[userIndex] = { id, ...updates }
    return HttpResponse.json(users[userIndex])
  }),

  // 模擬更新失敗 (PUT /api/users/:id/fail)
  http.put('/api/users/:id/fail', async ({ params, request }) => {
    const id = parseInt(params.id)
    const userIndex = users.findIndex((u) => u.id === id)
    if (userIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, statusText: 'Not Found', headers: { 'Content-Type': 'application/json' } }
      )
    }
    const updates = await request.json()
    if (!updates.name || !updates.email) {
      return new HttpResponse(
        JSON.stringify({ error: 'Name and email are required' }),
        { status: 400, statusText: 'Bad Request', headers: { 'Content-Type': 'application/json' } }
      )
    }
    return HttpResponse.json(users[userIndex])
  }),

  // 刪除 (DELETE /api/users/:id)
  http.delete('/api/users/:id', ({ params }) => {
    const id = parseInt(params.id)
    const userIndex = users.findIndex((u) => u.id === id)
    if (userIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, statusText: 'Not Found', headers: { 'Content-Type': 'application/json' } }
      )
    }
    users.splice(userIndex, 1)
    return HttpResponse.json({ message: 'User deleted' })
  }),

  // 模擬刪除失敗 (DELETE /api/users/:id/fail)
  http.delete('/api/users/:id/fail', ({ params }) => {
    const id = parseInt(params.id)
    const userIndex = users.findIndex((u) => u.id === id)
    if (userIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, statusText: 'Not Found', headers: { 'Content-Type': 'application/json' } }
      )
    }
    return HttpResponse.json({ message: 'User deleted' })
  }),

  // 檔案上傳 (POST /api/upload)
  http.post('/api/upload', async ({ request }) => {
    const data = await request.formData()
    const file = data.get('file')
    if (!file) {
      return new HttpResponse(
        JSON.stringify({ error: 'No file uploaded' }),
        { status: 400, statusText: 'Bad Request', headers: { 'Content-Type': 'application/json' } }
      )
    }
    // 模擬檔案大小限制 (假設 > 5MB 失敗)
    if (file.size > 5 * 1024 * 1024) {
      return new HttpResponse(
        JSON.stringify({ error: 'File size exceeds 5MB limit' }),
        { status: 413, statusText: 'Payload Too Large', headers: { 'Content-Type': 'application/json' } }
      )
    }
    // 模擬檔案類型檢查 (只接受 image/*)
    if (!file.type.startsWith('image/')) {
      return new HttpResponse(
        JSON.stringify({ error: 'Invalid file type, only images allowed' }),
        { status: 400, statusText: 'Bad Request', headers: { 'Content-Type': 'application/json' } }
      )
    }
    return HttpResponse.json({ message: 'File uploaded successfully', filename: file.name, size: file.size })
  }),

  // 模擬上傳失敗 (POST /api/upload/fail)
  http.post('/api/upload/fail', async ({ request }) => {
    const data = await request.formData()
    const file = data.get('file')
    if (!file) {
      return new HttpResponse(
        JSON.stringify({ error: 'No file uploaded' }),
        { status: 400, statusText: 'Bad Request', headers: { 'Content-Type': 'application/json' } }
      )
    }
    return new HttpResponse(
      JSON.stringify({ error: 'Upload failed due to server error' }),
      { status: 500, statusText: 'Internal Server Error', headers: { 'Content-Type': 'application/json' } }
    )
  }),

  // 模擬 404 (GET /api/not-found)
  http.get('/api/not-found', () => {
    return new HttpResponse(
      JSON.stringify({ error: 'Resource not found' }),
      { status: 404, statusText: 'Not Found', headers: { 'Content-Type': 'application/json' } }
    )
  }),

  // 模擬 500 (GET /api/server-error)
  http.get('/api/server-error', () => {
    return new HttpResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, statusText: 'Internal Server Error', headers: { 'Content-Type': 'application/json' } }
    )
  }),

  // 模擬 400 (POST /api/bad-request)
  http.post('/api/bad-request', () => {
    return new HttpResponse(
      JSON.stringify({ error: 'Invalid request data' }),
      { status: 400, statusText: 'Bad Request', headers: { 'Content-Type': 'application/json' } }
    )
  }),

  // 模擬 401 (GET /api/unauthorized)
  http.get('/api/unauthorized', () => {
    return new HttpResponse(
      JSON.stringify({ error: 'Unauthorized access' }),
      { status: 401, statusText: 'Unauthorized', headers: { 'Content-Type': 'application/json' } }
    )
  })
]