// src/pages/ApiTestPage.js
import { useState, useRef } from 'react';
import { Container, Paper, Button, Typography, Box, TextField, Divider } from '@mui/material';

export default function ApiTestPage() {
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
    <Container
      sx={{
        minHeight: '100vh',
        py: 5,
      }}
    >
      <Box sx={{ display: 'flex', maxWidth: 1100, mx: 'auto', gap: 4 }}>
        {/* 左側操作區塊 */}
        <Paper
          elevation={2}
          sx={{
            flex: 1,
            p: 5,
            borderRadius: 2,
            maxHeight: '80vh',
            overflow: 'auto',
          }}
        >
          <Typography variant="h4" align="center" sx={{ mb: 4, letterSpacing: 1 }}>
            CRUD & Error Testing with MSW
          </Typography>
          
          {/* 分頁查詢 */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 1.5, color: 'text.secondary' }}>
              查詢操作
            </Typography>
            <Button
              onClick={() => handleRequest('/api/users?page=1&limit=2')}
              variant="outlined"
              sx={{ mr: 1.5, mb: 1 }}
            >
              Get Users (Page 1, Limit 2)
            </Button>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          {/* 單筆查詢 */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 1.5, color: 'text.secondary' }}>
              單筆查詢
            </Typography>
            <Button
              onClick={() => handleRequest('/api/users/1')}
              variant="outlined"
              sx={{ mr: 1.5, mb: 1 }}
            >
              Get User by ID (1)
            </Button>
            <Button
              onClick={() => handleRequest('/api/users/999')}
              variant="outlined"
              sx={{ mr: 1.5, mb: 1 }}
            >
              Get User by ID (999, 404)
            </Button>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          {/* 創建 */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 1.5, color: 'text.secondary' }}>
              創建操作
            </Typography>
            <Button
              onClick={() =>
                handleRequest('/api/users', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: 'Eve', email: 'eve@example.com' })
                })
              }
              variant="outlined"
              sx={{ mr: 1.5, mb: 1 }}
            >
              Create User
            </Button>
            <Button
              onClick={() =>
                handleRequest('/api/users/fail', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({})
                })
              }
              variant="outlined"
              sx={{ mr: 1.5, mb: 1 }}
            >
              Create User (Fail, 400)
            </Button>
            <Button
              onClick={() =>
                handleRequest('/api/users/conflict', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: 'Eve', email: 'alice@example.com' })
                })
              }
              variant="outlined"
              sx={{ mr: 1.5, mb: 1 }}
            >
              Create User (Conflict, 409)
            </Button>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          {/* 更新 */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 1.5, color: 'text.secondary' }}>
              更新操作
            </Typography>
            <Button
              onClick={() =>
                handleRequest('/api/users/1', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: 'Alice Updated', email: 'alice.updated@example.com' })
                })
              }
              variant="outlined"
              sx={{ mr: 1.5, mb: 1 }}
            >
              Update User (ID 1)
            </Button>
            <Button
              onClick={() =>
                handleRequest('/api/users/999/fail', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: 'Invalid', email: 'invalid@example.com' })
                })
              }
              variant="outlined"
              sx={{ mr: 1.5, mb: 1 }}
            >
              Update User (ID 999, 404)
            </Button>
            <Button
              onClick={() =>
                handleRequest('/api/users/1/fail', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({})
                })
              }
              variant="outlined"
              sx={{ mr: 1.5, mb: 1 }}
            >
              Update User (ID 1, 400)
            </Button>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          {/* 刪除 */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 1.5, color: 'text.secondary' }}>
              刪除操作
            </Typography>
            <Button
              onClick={() =>
                handleRequest('/api/users/2', {
                  method: 'DELETE'
                })
              }
              variant="outlined"
              sx={{ mr: 1.5, mb: 1 }}
            >
              Delete User (ID 2)
            </Button>
            <Button
              onClick={() =>
                handleRequest('/api/users/999/fail', {
                  method: 'DELETE'
                })
              }
              variant="outlined"
              sx={{ mr: 1.5, mb: 1 }}
            >
              Delete User (ID 999, 404)
            </Button>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          {/* 檔案上傳 */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 1.5, color: 'text.secondary' }}>
              檔案上傳
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                id="file-input"
              />
              <label htmlFor="file-input">
                <Button variant="outlined" component="span">
                  Choose File
                </Button>
              </label>
              <Button
                onClick={() => handleUpload(false)}
                variant="outlined"
              >
                Upload File
              </Button>
              <Button
                onClick={() => handleUpload(true)}
                variant="outlined"
              >
                Upload File (Fail, 500)
              </Button>
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          {/* 錯誤測試 */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 1.5, color: 'text.secondary' }}>
              錯誤測試
            </Typography>
            <Button
              onClick={() => handleRequest('/api/not-found')}
              variant="outlined"
              sx={{ mr: 1.5, mb: 1 }}
            >
              Test 404 (Not Found)
            </Button>
            <Button
              onClick={() => handleRequest('/api/server-error')}
              variant="outlined"
              sx={{ mr: 1.5, mb: 1 }}
            >
              Test 500 (Server Error)
            </Button>
            <Button
              onClick={() =>
                handleRequest('/api/bad-request', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({})
                })
              }
              variant="outlined"
              sx={{ mr: 1.5, mb: 1 }}
            >
              Test 400 (Bad Request)
            </Button>
            <Button
              onClick={() => handleRequest('/api/unauthorized')}
              variant="outlined"
              sx={{ mr: 1.5, mb: 1 }}
            >
              Test 401 (Unauthorized)
            </Button>
          </Box>
        </Paper>
        
        {/* 右側 JSON 回應區塊 */}
        <Paper
          elevation={1}
          sx={{
            width: 420,
            minHeight: 400,
            borderRadius: 2,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>
            Response
          </Typography>
          {response ? (
            <Box
              component="pre"
              sx={{
                background: 'grey.50',
                p: 2.5,
                borderRadius: 1,
                fontSize: '15px',
                lineHeight: 1.6,
                flex: 1,
                overflow: 'auto',
                fontFamily: 'monospace',
              }}
            >
              {JSON.stringify(response, null, 2)}
            </Box>
          ) : (
            <Typography sx={{ color: 'text.secondary', textAlign: 'center', mt: 5 }}>
              尚無回應
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  )
}
