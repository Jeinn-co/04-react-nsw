import { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box } from '@mui/material';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    const data = await res.json();
    if (res.ok) onLogin(data.user);
    else alert(data.error);
  };

  return (
    <Container
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          minWidth: 320,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" align="center" sx={{ mb: 3 }}>
          登入
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            placeholder="請輸入使用者名稱"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            size="medium"
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ py: 1.5 }}
          >
            登入
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
