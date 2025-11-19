import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShield, FiLock, FiLogIn, FiArrowRight } from 'react-icons/fi';
import { HiOutlineShieldCheck } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import '../../styles/App.css';

const AdminLogin = () => {
  const [adminID, setAdminID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.adminLogin(adminID, password);
      login(response.user, response.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-container ${theme}`}>
      <motion.div 
        className="login-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          <HiOutlineShieldCheck 
            size={64} 
            style={{ 
              color: 'var(--primary-color)', 
              marginBottom: '1rem',
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
            }} 
          />
        </motion.div>
        <h2 className="login-title">Admin Login</h2>
        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ 
              color: 'var(--danger-color)', 
              marginBottom: '1rem',
              padding: '0.75rem',
              backgroundColor: 'rgba(220, 53, 69, 0.1)',
              borderRadius: '8px',
              border: '1px solid var(--danger-color)'
            }}
          >
            {error}
          </motion.div>
        )}
        <form onSubmit={handleSubmit}>
          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="form-label">
              <FiShield style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Admin ID
            </label>
            <input
              type="text"
              className="form-input"
              value={adminID}
              onChange={(e) => setAdminID(e.target.value)}
              required
              placeholder="Enter your Admin ID"
            />
          </motion.div>
          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="form-label">
              <FiLock style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Password
            </label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </motion.div>
          <motion.button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading} 
            style={{ width: '100%' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <FiLogIn style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>
        <motion.p 
          style={{ textAlign: 'center', marginTop: '1.5rem' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link 
            to="/student/login" 
            style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '0.875rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <FiArrowRight size={14} />
            Student Login
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
