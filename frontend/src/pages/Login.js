
import React, { useState, useEffect } from 'react';
import '../App.css';

// Loading Spinner 
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner-ring"></div>
    <div className="spinner-dots">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);

//  background
const ParticleBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          duration: Math.random() * 20 + 10,
          delay: Math.random() * 5,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="particle-background">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

//  Input Component 
const AnimatedInput = ({ type, placeholder, value, onChange, required, disabled, icon }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(value && value.length > 0);
  }, [value]);

  return (
    <div className="input-container">
      <div className="input-wrapper">
        {icon && <div className="input-icon">{icon}</div>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`animated-input ${isFocused ? 'focused' : ''} ${hasValue ? 'has-value' : ''}`}
        />
        <label className={`floating-label ${isFocused || hasValue ? 'active' : ''}`}>
          {placeholder}
        </label>
        <div className="input-border"></div>
      </div>
    </div>
  );
};

//  Button Component
const AnimatedButton = ({ children, onClick, disabled, className = "", loading = false }) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    if (disabled || loading) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      x,
      y,
      id: Date.now(),
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 1000);

    if (onClick) onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`animated-button ${className} ${loading ? 'loading' : ''} ${disabled ? 'disabled' : ''}`}
    >
      <span className="button-content">
        {loading ? <LoadingSpinner /> : children}
      </span>
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
    </button>
  );
};

//  Login Component
const Login = ({ onLogin, goToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Unexpected server response");
      }

      if (!res.ok) throw new Error(data.message || 'Login failed');
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="enhanced-auth-container">
      <ParticleBackground />
      
      <div className={`auth-card ${isVisible ? 'visible' : ''}`}>
        <div className="auth-header">
          <h2 className="enhanced-laser-tag">
            <span className="laser-text">Login</span>
            <div className="laser-underline"></div>
          </h2>
          <p className="auth-subtitle">Welcome back! Please sign in to your account</p>
        </div>

        <div className="enhanced-auth-form" onKeyPress={handleKeyPress}>
          <AnimatedInput
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
            icon="📧"
          />

          <AnimatedInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
            icon="🔒"
          />

          <AnimatedButton
            onClick={handleSubmit}
            disabled={loading}
            loading={loading}
            className="login-button"
          >
            Sign In
          </AnimatedButton>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
        </div>

        <div className="auth-footer">
          <p className="auth-switch">
            Don't have an account?{' '}
            <button 
              className="link-button" 
              type="button" 
              onClick={goToSignup}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;