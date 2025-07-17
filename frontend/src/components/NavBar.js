
import React from 'react';

const NavBar = ({ currentTab, setCurrentTab, onLogout }) => (
  <nav className="navbar">
    <button
      className={currentTab === 'students' ? 'active' : ''}
      onClick={() => setCurrentTab('students')}
    >
      All Students
    </button>
    <button
      className={currentTab === 'profile' ? 'active' : ''}
      onClick={() => setCurrentTab('profile')}
    >
      Profile
    </button>
    <button className="logout-btn" onClick={onLogout}>Logout</button>
  </nav>
);

export default NavBar; 