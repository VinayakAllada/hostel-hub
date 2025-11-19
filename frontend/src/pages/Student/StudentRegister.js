import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiUser, FiMail, FiLock, FiHome, FiHash, 
  FiUserPlus, FiArrowLeft, FiCheck 
} from 'react-icons/fi';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import '../../styles/App.css';

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    studentID: '',
    roomNO: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      const response = await api.studentRegister(userData);
      login(response.user, response.token);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    { name: 'studentID', label: 'Student ID', icon: FiHash, placeholder: 'Enter your Student ID' },
    { name: 'roomNO', label: 'Room Number', icon: FiHome, placeholder: 'Enter your Room Number' },
    { name: 'name', label: 'Name', icon: FiUser, placeholder: 'Enter your full name' },
    { name: 'email', label: 'Email', icon: FiMail, placeholder: 'Enter your email address' },
    { name: 'password', label: 'Password', icon: FiLock, placeholder: 'Create a password (min. 6 characters)', type: 'password' },
    { name: 'confirmPassword', label: 'Confirm Password', icon: FiCheck, placeholder: 'Confirm your password', type: 'password' },
  ];

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
          <HiOutlineUserCircle 
            size={64} 
            style={{ 
              color: 'var(--primary-color)', 
              marginBottom: '1rem',
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
            }} 
          />
        </motion.div>
        <h2 className="login-title">Student Register</h2>
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
          {formFields.map((field, index) => {
            const Icon = field.icon;
            return (
              <motion.div 
                key={field.name}
                className="form-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <label className="form-label">
                  <Icon style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  {field.label} *
                </label>
                <input
                  type={field.type || 'text'}
                  className="form-input"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  placeholder={field.placeholder}
                />
              </motion.div>
            );
          })}
          <motion.button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading} 
            style={{ width: '100%' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <FiUserPlus style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            {loading ? 'Registering...' : 'Register'}
          </motion.button>
        </form>
        <motion.p 
          style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Already have an account?{' '}
          <Link 
            to="/student/login" 
            style={{ 
              color: 'var(--primary-color)',
              fontWeight: 500,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <FiArrowLeft size={14} />
            Login
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default StudentRegister;
