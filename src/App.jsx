import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import ApiTestPage from './pages/ApiTestPage';
import ProfilePage from './pages/ProfilePage';
import Header from './components/Header';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      {user && <Header user={user} onLogout={() => setUser(null)} />}
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/api-test" /> : <LoginPage onLogin={setUser} />
        } />
        <Route path="/api-test" element={
          user ? <ApiTestPage /> : <Navigate to="/login" />
        } />
        <Route path="/profile" element={
          user ? <ProfilePage /> : <Navigate to="/login" />
        } />
        <Route path="*" element={
          <Navigate to={user ? "/api-test" : "/login"} />
        } />
      </Routes>
    </Router>
  );
}

export default App;
