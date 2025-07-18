// pages/Profile.js
import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = ({ token, user, setUser }) => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    setForm({ name: user?.name || '', email: user?.email || '' });
  }, [user]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Unexpected server response");
      }

      if (!res.ok) throw new Error(data.message || 'Update failed');
      setUser(data.user);
      setSuccess('Profile updated!');
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayFees = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/profile/pay`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Unexpected server response");
      }

      if (!res.ok) throw new Error(data.message || 'Payment failed');
      setUser(data.user);
      setSuccess('Fees paid successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {editMode ? (
        <form onSubmit={handleUpdate} className="profile-form">
          <input name="name" value={form.name} onChange={handleChange} required disabled={loading} />
          <input name="email" value={form.email} onChange={handleChange} required disabled={loading} />
          <button type="submit" disabled={loading} className={loading ? 'wiggle' : ''}>
            {loading ? <LoadingSpinner /> : 'Save'}
          </button>
          <button type="button" onClick={() => setEditMode(false)} disabled={loading}>Cancel</button>
        </form>
      ) : (
        <div className="profile-details">
          <p><b>Name:</b> {user?.name}</p>
          <p><b>Email:</b> {user?.email}</p>
          <p><b>Fees Paid:</b> {user?.feesPaid ? 'Yes' : 'No'}</p>
          <button onClick={() => setEditMode(true)} disabled={loading}>Edit</button>
        </div>
      )}

      {!user?.feesPaid && (
        <div className="pay-fees-section">
          <button onClick={handlePayFees} disabled={loading} className={loading ? 'wiggle' : ''}>
            {loading ? <LoadingSpinner /> : 'Pay Fees'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
