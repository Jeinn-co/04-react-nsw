import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Avatar, Button, Typography, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <AppBar position="static" sx={{ boxShadow: 1, borderRadius: '0 0 18px 18px' }}>
      <Toolbar sx={{ gap: 2 }}>
        <Avatar src={user.avatar} sx={{ width: 36, height: 36 }} />
        <Typography variant="body1" color="inherit" sx={{ mr: 3, fontSize: '17px' }}>
          {user.username}
        </Typography>
        <Button
          component={Link}
          to="/api-test"
          color="inherit"
          sx={{
            '&:hover': { background: 'action.hover' },
            borderRadius: '8px',
            px: 2,
          }}
        >
          API 測試
        </Button>
        <Button
          component={Link}
          to="/profile"
          color="inherit"
          sx={{
            '&:hover': { background: 'action.hover' },
            borderRadius: '8px',
            px: 2,
          }}
        >
          Profile
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          onClick={logout}
          variant="outlined"
          color="inherit"
          sx={{
            borderRadius: '8px',
            px: 2.5,
          }}
        >
          登出
        </Button>
      </Toolbar>
    </AppBar>
  );
}
