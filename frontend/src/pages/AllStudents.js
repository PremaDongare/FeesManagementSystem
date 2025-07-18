
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import LoadingSpinner from '../components/LoadingSpinner';
import '../AllStudent.css';

const AllStudents = ({ token }) => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFees, setFilterFees] = useState('all');
  const socketRef = useRef(null);
  const containerRef = useRef(null);
  const API = process.env.REACT_APP_API_URL;

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Unexpected server response");
      }

      if (!res.ok) throw new Error(data.message || 'Failed to fetch students');
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();

    if (!socketRef.current) {
      socketRef.current = io(API, { transports: ['websocket'] });

      socketRef.current.on('feesPaid', () => {
        fetchStudents();
      });

      socketRef.current.on('connect_error', () => {
        console.warn("Socket connection failed.");
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [API, token]);

  
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.classList.add('visible');
    }
  }, []);

  // Filter 
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterFees === 'all' || 
                         (filterFees === 'paid' && student.feesPaid) ||
                         (filterFees === 'unpaid' && !student.feesPaid);
    
    return matchesSearch && matchesFilter;
  });

  const handleRefresh = () => {
    fetchStudents();
  };

  return (
    <div className="enhanced-students-container">
      {/* Particle Background */}
      <div className="particle-background">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      <div className="students-card" ref={containerRef}>
        {/* Header Section */}
        <div className="students-header">
          <div className="header-content">
            <h2 className="students-title">
              <span className="laser-text">All Students</span>
            </h2>
            <p className="students-subtitle">
              Manage and view all registered students
            </p>
          </div>
          <button 
            className="refresh-button animated-button"
            onClick={handleRefresh}
            disabled={loading}
          >
            <span className="button-content">
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner-ring"></div>
                  <span>Refreshing...</span>
                </div>
              ) : (
                <>
                  <span className="refresh-icon">🔄</span>
                  Refresh
                </>
              )}
            </span>
          </button>
        </div>

        {/* Controls Section */}
        <div className="students-controls">
          <div className="search-container">
            <div className="input-wrapper">
              <span className="input-icon">🔍</span>
              <input
                type="text"
                className="animated-input search-input"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="filter-container">
            <select
              className="animated-select"
              value={filterFees}
              onChange={(e) => setFilterFees(e.target.value)}
            >
              <option value="all">All Students</option>
              <option value="paid">Fees Paid</option>
              <option value="unpaid">Fees Unpaid</option>
            </select>
          </div>
        </div>

        {/* Stats Section */}
        <div className="students-stats">
          <div className="stat-card">
            <div className="stat-number">{students.length}</div>
            <div className="stat-label">Total Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{students.filter(s => s.feesPaid).length}</div>
            <div className="stat-label">Fees Paid</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{students.filter(s => !s.feesPaid).length}</div>
            <div className="stat-label">Fees Pending</div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Content Section */}
        {loading ? (
          <div className="loading-container">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="table-container">
            <div className="table-wrapper">
              <table className="enhanced-students-table">
                <thead>
                  <tr>
                    <th>
                      <div className="th-content">
                        <span className="th-icon">👤</span>
                        Name
                      </div>
                    </th>
                    <th>
                      <div className="th-content">
                        <span className="th-icon">📧</span>
                        Email
                      </div>
                    </th>
                    <th>
                      <div className="th-content">
                        <span className="th-icon">💰</span>
                        Fees Status
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="no-data">
                        <div className="no-data-content">
                          <span className="no-data-icon">📋</span>
                          <span>No students found</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, index) => (
                      <tr 
                        key={student._id} 
                        className="table-row"
                        style={{
                          animationDelay: `${index * 0.1}s`
                        }}
                      >
                        <td className="student-name">
                          <div className="name-content">
                            <div className="name-avatar">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <span>{student.name}</span>
                          </div>
                        </td>
                        <td className="student-email">
                          <span className="email-text">{student.email}</span>
                        </td>
                        <td className="student-fees">
                          <span className={`fees-badge ${student.feesPaid ? 'paid' : 'unpaid'}`}>
                            <span className="badge-icon">
                              {student.feesPaid ? '✅' : '❌'}
                            </span>
                            {student.feesPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="students-footer">
          <div className="footer-info">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllStudents;