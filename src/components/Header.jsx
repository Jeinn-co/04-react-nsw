import { Link } from 'react-router-dom';

export default function Header({ user, onLogout }) {
  return (
    <header style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <img src={user.avatar} alt="avatar" width="30" style={{ borderRadius: '50%' }} />
      <span style={{ marginLeft: '10px', marginRight: '20px' }}>{user.username}</span>
      <Link to="/api-test" style={{ marginRight: '10px' }}>API 測試</Link>
      <Link to="/profile" style={{ marginRight: '10px' }}>Profile</Link>
      <button onClick={onLogout}>登出</button>
    </header>
  );
}
