import { useEffect, useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Avatar, Box } from '@mui/material';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setNewName(data.username);
      });
  }, []);

  const handleUpdate = async () => {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: newName })
    });
    const data = await res.json();
    if (res.ok) setProfile(data);
    else alert(data.error);
  };

  if (!profile) return <Typography>Loading...</Typography>;

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
          minWidth: 340,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" sx={{ mb: 2.5 }}>
          個人資料
        </Typography>
        <Avatar
          src={profile.avatar}
          sx={{
            width: 96,
            height: 96,
            mx: 'auto',
            mb: 2,
          }}
        />
        <Typography variant="h6" sx={{ mb: 1 }}>
          使用者名稱：{profile.username}
        </Typography>
        <Box sx={{ mt: 2.5, display: 'flex', gap: 1.5, justifyContent: 'center' }}>
          <TextField
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
          />
          <Button
            onClick={handleUpdate}
            variant="contained"
          >
            更新
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
