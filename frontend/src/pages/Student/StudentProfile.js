// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { FiUser, FiMail, FiHome, FiHash, FiEdit2, FiSave, FiX, FiLock, FiCheck } from 'react-icons/fi';
// import { HiOutlineUserCircle } from 'react-icons/hi';
// import Layout from '../../components/Layout';
// import { useAuth } from '../../context/AuthContext';
// import api from '../../services/api';
// import '../../styles/App.css';

// const StudentProfile = () => {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     roomNO: ''
//   });
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const data = await api.getStudentProfile();
//       setProfile(data);
//       setFormData({
//         name: data.name,
//         email: data.email,
//         roomNO: data.roomNO
//       });
//     } catch (error) {
//       setMessage(error.message || 'Error fetching profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleProfileChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handlePasswordChange = (e) => {
//     setPasswordData({
//       ...passwordData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleProfileSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');

//     try {
//       await api.updateStudentProfile(formData);
//       setMessage('Profile updated successfully!');
//       setEditMode(false);
//       fetchProfile();
//     } catch (error) {
//       setMessage(error.message || 'Error updating profile');
//     }
//   };

//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');

//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       setMessage('New passwords do not match');
//       return;
//     }

//     if (passwordData.newPassword.length < 6) {
//       setMessage('Password must be at least 6 characters');
//       return;
//     }

//     try {
//       await api.changePassword(passwordData.currentPassword, passwordData.newPassword);
//       setMessage('Password changed successfully!');
//       setPasswordData({
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//       });
//     } catch (error) {
//       setMessage(error.message || 'Error changing password');
//     }
//   };

//   if (loading) {
//     return (
//       <Layout role="student">
//         <div>Loading...</div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout role="student">
//       <div className="container">
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <h1 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
//             <HiOutlineUserCircle size={40} style={{ color: 'var(--primary-color)' }} />
//             My Profile
//           </h1>
//         </motion.div>

//         {message && (
//           <div className={`card ${message.includes('successfully') ? '' : ''}`} style={{ 
//             marginBottom: '1.5rem',
//             backgroundColor: message.includes('successfully') ? 'var(--success-color)' : 'var(--danger-color)',
//             color: 'white',
//             padding: '1rem'
//           }}>
//             {message}
//           </div>
//         )}

//         <motion.div 
//           className="card" 
//           style={{ marginBottom: '2rem' }}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//         >
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
//             <h2 className="card-title">
//               <FiUser />
//               Profile Information
//             </h2>
//             {!editMode && (
//               <motion.button 
//                 className="btn btn-primary" 
//                 onClick={() => setEditMode(true)}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <FiEdit2 />
//                 Edit Profile
//               </motion.button>
//             )}
//           </div>

//           {editMode ? (
//             <form onSubmit={handleProfileSubmit}>
//               <div className="form-group">
//                 <label className="form-label">
//                   <FiHash style={{ marginRight: '0.5rem' }} />
//                   Student ID
//                 </label>
//                 <input
//                   type="text"
//                   className="form-input"
//                   value={profile.studentID}
//                   disabled
//                   style={{ backgroundColor: 'var(--bg-hover)' }}
//                 />
//               </div>
//               <div className="form-group">
//                 <label className="form-label">
//                   <FiUser style={{ marginRight: '0.5rem' }} />
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   className="form-input"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleProfileChange}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label className="form-label">
//                   <FiMail style={{ marginRight: '0.5rem' }} />
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   className="form-input"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleProfileChange}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label className="form-label">
//                   <FiHome style={{ marginRight: '0.5rem' }} />
//                   Room Number
//                 </label>
//                 <input
//                   type="text"
//                   className="form-input"
//                   name="roomNO"
//                   value={formData.roomNO}
//                   onChange={handleProfileChange}
//                   required
//                 />
//               </div>
//               <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
//                 <motion.button 
//                   type="submit" 
//                   className="btn btn-success"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <FiSave />
//                   Save Changes
//                 </motion.button>
//                 <motion.button 
//                   type="button" 
//                   className="btn btn-danger" 
//                   onClick={() => {
//                     setEditMode(false);
//                     setFormData({
//                       name: profile.name,
//                       email: profile.email,
//                       roomNO: profile.roomNO
//                     });
//                   }}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <FiX />
//                   Cancel
//                 </motion.button>
//               </div>
//             </form>
//           ) : (
//             <div style={{ display: 'grid', gap: '1rem' }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--bg-hover)', borderRadius: '8px' }}>
//                 <FiHash style={{ color: 'var(--primary-color)' }} />
//                 <span><strong>Student ID:</strong> {profile.studentID}</span>
//               </div>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--bg-hover)', borderRadius: '8px' }}>
//                 <FiUser style={{ color: 'var(--primary-color)' }} />
//                 <span><strong>Name:</strong> {profile.name}</span>
//               </div>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--bg-hover)', borderRadius: '8px' }}>
//                 <FiMail style={{ color: 'var(--primary-color)' }} />
//                 <span><strong>Email:</strong> {profile.email}</span>
//               </div>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--bg-hover)', borderRadius: '8px' }}>
//                 <FiHome style={{ color: 'var(--primary-color)' }} />
//                 <span><strong>Room Number:</strong> {profile.roomNO}</span>
//               </div>
//             </div>
//           )}
//         </motion.div>

//         <motion.div 
//           className="card"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//         >
//           <h2 className="card-title">
//             <FiLock />
//             Change Password
//           </h2>
//           <form onSubmit={handlePasswordSubmit}>
//               <div className="form-group">
//                 <label className="form-label">
//                   <FiLock style={{ marginRight: '0.5rem' }} />
//                   Current Password
//                 </label>
//                 <input
//                   type="password"
//                   className="form-input"
//                   name="currentPassword"
//                   value={passwordData.currentPassword}
//                   onChange={handlePasswordChange}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label className="form-label">
//                   <FiLock style={{ marginRight: '0.5rem' }} />
//                   New Password
//                 </label>
//                 <input
//                   type="password"
//                   className="form-input"
//                   name="newPassword"
//                   value={passwordData.newPassword}
//                   onChange={handlePasswordChange}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label className="form-label">
//                   <FiCheck style={{ marginRight: '0.5rem' }} />
//                   Confirm New Password
//                 </label>
//                 <input
//                   type="password"
//                   className="form-input"
//                   name="confirmPassword"
//                   value={passwordData.confirmPassword}
//                   onChange={handlePasswordChange}
//                   required
//                 />
//               </div>
//               <motion.button 
//                 type="submit" 
//                 className="btn btn-primary"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <FiLock />
//                 Change Password
//               </motion.button>
//           </form>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default StudentProfile;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiHome, FiHash, FiEdit2, FiSave, FiX, FiLock, FiCheck } from 'react-icons/fi';
import { HiOutlineUserCircle } from 'react-icons/hi';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/App.css';

const StudentProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roomNO: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api.getStudentProfile();
      setProfile(data);
      setFormData({
        name: data.name,
        email: data.email,
        roomNO: data.roomNO
      });
    } catch (error) {
      setMessage(error.message || 'Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await api.updateStudentProfile(formData);
      setMessage('Profile updated successfully!');
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      setMessage(error.message || 'Error updating profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    try {
      await api.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setMessage('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage(error.message || 'Error changing password');
    }
  };

  if (loading) {
    return (
      <Layout role="student">
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout role="student">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <HiOutlineUserCircle size={40} style={{ color: 'var(--primary-color)' }} />
            My Profile
          </h1>
        </motion.div>

        {message && (
          <div className={`card ${message.includes('successfully') ? '' : ''}`} style={{ 
            marginBottom: '1.5rem',
            backgroundColor: message.includes('successfully') ? 'var(--success-color)' : 'var(--danger-color)',
            color: 'white',
            padding: '1rem'
          }}>
            {message}
          </div>
        )}

        <motion.div 
          className="card" 
          style={{ marginBottom: '2rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 className="card-title">
              <FiUser />
              Profile Information
            </h2>
            {!editMode && (
              <motion.button 
                className="btn btn-primary" 
                onClick={() => setEditMode(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiEdit2 />
                Edit Profile
              </motion.button>
            )}
          </div>

          {editMode ? (
            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <FiHash style={{ marginRight: '0.5rem' }} />
                  Student ID
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.studentID}
                  disabled
                  style={{ backgroundColor: 'var(--bg-hover)' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <FiUser style={{ marginRight: '0.5rem' }} />
                  Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  name="name"
                  value={formData.name}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <FiMail style={{ marginRight: '0.5rem' }} />
                  Email
                </label>
                <input
                  type="email"
                  className="form-input"
                  name="email"
                  value={formData.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <FiHome style={{ marginRight: '0.5rem' }} />
                  Room Number
                </label>
                <input
                  type="text"
                  className="form-input"
                  name="roomNO"
                  value={formData.roomNO}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <motion.button 
                  type="submit" 
                  className="btn btn-success"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiSave />
                  Save Changes
                </motion.button>
                <motion.button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      name: profile.name,
                      email: profile.email,
                      roomNO: profile.roomNO
                    });
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiX />
                  Cancel
                </motion.button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--bg-hover)', borderRadius: '8px' }}>
                <FiHash style={{ color: 'var(--primary-color)' }} />
                <span><strong>Student ID:</strong> {profile.studentID}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--bg-hover)', borderRadius: '8px' }}>
                <FiUser style={{ color: 'var(--primary-color)' }} />
                <span><strong>Name:</strong> {profile.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--bg-hover)', borderRadius: '8px' }}>
                <FiMail style={{ color: 'var(--primary-color)' }} />
                <span><strong>Email:</strong> {profile.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--bg-hover)', borderRadius: '8px' }}>
                <FiHome style={{ color: 'var(--primary-color)' }} />
                <span><strong>Room Number:</strong> {profile.roomNO}</span>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="card-title">
            <FiLock />
            Change Password
          </h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label className="form-label">
                <FiLock style={{ marginRight: '0.5rem' }} />
                Current Password
              </label>
              <input
                type="password"
                className="form-input"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <FiLock style={{ marginRight: '0.5rem' }} />
                New Password
              </label>
              <input
                type="password"
                className="form-input"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <FiCheck style={{ marginRight: '0.5rem' }} />
                Confirm New Password
              </label>
              <input
                type="password"
                className="form-input"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <motion.button 
              type="submit" 
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiLock />
              Change Password
            </motion.button>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
};

export default StudentProfile;