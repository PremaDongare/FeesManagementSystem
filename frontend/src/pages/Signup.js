
import React, { useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const Signup = ({ goToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const text = await res.text();
      console.log('Raw response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        throw new Error('Server did not return valid JSON.');
      }

      if (!res.ok) {
        console.log('Signup failed:', data.message);
        throw new Error(data.message || 'Signup failed');
      }

      // Signup success
      console.log('Signup success:', data);
      setSuccess('Signup successful! You can now log in.');
      setName('');
      setEmail('');
      setPassword('');
      
    } catch (err) {
      console.error('Signup error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="laser-tag">Sign Up</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading} className={loading ? 'wiggle' : ''}>
          {loading ? <LoadingSpinner /> : 'Sign Up'}
        </button>

        {error && <div className="error">{error}</div>}
        {success && (
          <div className="success">
            {success}
            <br />
            <button className="link-btn" type="button" onClick={goToLogin}>
              Go to Login
            </button>
          </div>
        )}
      </form>

      {!success && (
        <p>
          Already have an account?{' '}
          <button className="link-btn" type="button" onClick={goToLogin}>
            Login
          </button>
        </p>
      )}
    </div>
  );
};

export default Signup;
