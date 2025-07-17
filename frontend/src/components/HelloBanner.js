import React from 'react';
import './HelloBanner.css';

const HelloBanner = ({ username }) => {
  if (!username) return null;
  return (
    <div className="hello-banner">
      <span className="scrolling-text">Hello {username}</span>
    </div>
  );
};

export default HelloBanner; 