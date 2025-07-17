import React, { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AllStudents from './pages/AllStudents';
import Profile from './pages/Profile';
import NavBar from './components/NavBar';
import HelloBanner from './components/HelloBanner';
import './App.css';

function App() {
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('token');
    return t && t !== 'null' && t !== 'undefined' ? t : null;
  });
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('user');
      if (!u || u === 'null' || u === 'undefined') return null;
      return JSON.parse(u);
    } catch {
      return null;
    }
  });
  const [currentTab, setCurrentTab] = useState('students');
  const [page, setPage] = useState('login'); 

  const handleLogin = (data) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setPage('main');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setPage('login');
  };

  // Navigation handlers
  const goToSignup = () => setPage('signup');
  const goToLogin = () => setPage('login');

  // Authenticated
  if (token && user) {
    return (
      <div className="app-container">
        <HelloBanner username={user?.name} />
        <NavBar currentTab={currentTab} setCurrentTab={setCurrentTab} onLogout={handleLogout} />
        <div className="main-content">
          {currentTab === 'students' && <AllStudents token={token} />}
          {currentTab === 'profile' && <Profile token={token} user={user} setUser={setUser} />}
        </div>
      </div>
    );
  }

  // Not authenticated
  if (page === 'signup') {
    return <Signup goToLogin={goToLogin} />;
  }
  return <Login onLogin={handleLogin} goToSignup={goToSignup} />;
}

export default App;
