// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { FiAlertCircle, FiPlus, FiX, FiZap, FiDroplet, FiCoffee, FiWind, FiLightbulb, FiMoreHorizontal } from 'react-icons/fi';
// import Layout from '../../components/Layout';
// import { useAuth } from '../../context/AuthContext';
// import api from '../../services/api';
// import '../../styles/App.css';

// const StudentComplaints = () => {
//   const { user } = useAuth();
//   const [complaints, setComplaints] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     category: 'electricity',
//     description: ''
//   });
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('');

//   const categories = [
//     { value: 'electricity', label: 'Electricity', icon: FiZap },
//     { value: 'water', label: 'Water', icon: FiDroplet },
//     { value: 'mess', label: 'Mess', icon: FiCoffee },
//     { value: 'fans', label: 'Fans', icon: FiWind },
//     { value: 'lightbulb', label: 'Lightbulb', icon: FiLightbulb },
//     { value: 'other', label: 'Other', icon: FiMoreHorizontal }
//   ];

//   useEffect(() => {
//     fetchComplaints();
//   }, []);

//   const fetchComplaints = async () => {
//     try {
//       const data = await api.getMyComplaints();
//       setComplaints(data);
//     } catch (error) {
//       setMessage(error.message || 'Error fetching complaints');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');

//     try {
//       await api.createComplaint(formData);
//       setMessage('Complaint submitted successfully!');
//       setFormData({ category: 'electricity', description: '' });
//       setShowForm(false);
//       fetchComplaints();
//     } catch (error) {
//       setMessage(error.message || 'Error submitting complaint');
//     }
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: 'badge-pending',
//       accepted: 'badge-accepted',
//       resolved: 'badge-resolved'
//     };
//     return badges[status] || 'badge-pending';
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
//           style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//             <FiAlertCircle style={{ color: 'var(--primary-color)' }} />
//             My Complaints
//           </h1>
//           <motion.button 
//             className="btn btn-primary" 
//             onClick={() => setShowForm(!showForm)}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             {showForm ? (
//               <>
//                 <FiX />
//                 Cancel
//               </>
//             ) : (
//               <>
//                 <FiPlus />
//                 New Complaint
//               </>
//             )}
//           </motion.button>
//         </motion.div>

//         {message && (
//           <div className="card" style={{ 
//             marginBottom: '1.5rem',
//             backgroundColor: message.includes('successfully') ? 'var(--success-color)' : 'var(--danger-color)',
//             color: 'white',
//             padding: '1rem'
//           }}>
//             {message}
//           </div>
//         )}

//         {showForm && (
//           <motion.div 
//             className="card" 
//             style={{ marginBottom: '2rem' }}
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <h2 className="card-title">
//               <FiPlus />
//               Submit New Complaint
//             </h2>
//             <form onSubmit={handleSubmit}>
//               <div className="form-group">
//                 <label className="form-label">
//                   <FiAlertCircle style={{ marginRight: '0.5rem' }} />
//                   Category
//                 </label>
//                 <select
//                   className="form-input"
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   required
//                 >
//                   {categories.map(cat => {
//                     const Icon = cat.icon;
//                     return (
//                       <option key={cat.value} value={cat.value}>
//                         {cat.label}
//                       </option>
//                     );
//                   })}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label className="form-label">Description</label>
//                 <textarea
//                   className="form-input"
//                   name="description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   rows="5"
//                   required
//                 />
//               </div>
//               <button type="submit" className="btn btn-primary">Submit Complaint</button>
//             </form>
//           </div>
//         )}

//         <div className="card">
//           <h2 className="card-title">Complaint History</h2>
//           {complaints.length > 0 ? (
//             <div className="table-wrapper">
//               <table className="table">
//               <thead>
//                 <tr>
//                   <th>Category</th>
//                   <th>Description</th>
//                   <th>Status</th>
//                   <th>Resolution Date</th>
//                   <th>Resolution Time</th>
//                   <th>Submitted</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {complaints.map((complaint) => (
//                   <tr key={complaint._id}>
//                     <td style={{ textTransform: 'capitalize' }}>{complaint.category}</td>
//                     <td>{complaint.description}</td>
//                     <td>
//                       <span className={`badge ${getStatusBadge(complaint.status)}`}>
//                         {complaint.status}
//                       </span>
//                     </td>
//                     <td>{complaint.resolutionDate ? new Date(complaint.resolutionDate).toLocaleDateString() : '-'}</td>
//                     <td>{complaint.resolutionTime || '-'}</td>
//                     <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//               </table>
//             </div>
//           ) : (
//             <p style={{ textAlign: 'center', padding: '2rem' }}>No complaints found</p>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default StudentComplaints;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiPlus, FiX, FiZap, FiDroplet, FiCoffee, FiWind, FiMoreHorizontal } from 'react-icons/fi';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/App.css';

const StudentComplaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'electricity',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const categories = [
    { value: 'electricity', label: 'Electricity', icon: FiZap },
    { value: 'water', label: 'Water', icon: FiDroplet },
    { value: 'mess', label: 'Mess', icon: FiCoffee },
    { value: 'fans', label: 'Fans', icon: FiWind },
    { value: 'lighting', label: 'Lighting', icon: FiZap }, // Using FiZap as replacement for lightbulb
    { value: 'other', label: 'Other', icon: FiMoreHorizontal }
  ];

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const data = await api.getMyComplaints();
      setComplaints(data);
    } catch (error) {
      setMessage(error.message || 'Error fetching complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await api.createComplaint(formData);
      setMessage('Complaint submitted successfully!');
      setFormData({ category: 'electricity', description: '' });
      setShowForm(false);
      fetchComplaints();
    } catch (error) {
      setMessage(error.message || 'Error submitting complaint');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-pending',
      accepted: 'badge-accepted',
      resolved: 'badge-resolved'
    };
    return badges[status] || 'badge-pending';
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
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiAlertCircle style={{ color: 'var(--primary-color)' }} />
            My Complaints
          </h1>
          <motion.button 
            className="btn btn-primary" 
            onClick={() => setShowForm(!showForm)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showForm ? (
              <>
                <FiX />
                Cancel
              </>
            ) : (
              <>
                <FiPlus />
                New Complaint
              </>
            )}
          </motion.button>
        </motion.div>

        {message && (
          <div className="card" style={{ 
            marginBottom: '1.5rem',
            backgroundColor: message.includes('successfully') ? 'var(--success-color)' : 'var(--danger-color)',
            color: 'white',
            padding: '1rem'
          }}>
            {message}
          </div>
        )}

        {showForm && (
          <motion.div 
            className="card" 
            style={{ marginBottom: '2rem' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="card-title">
              <FiPlus />
              Submit New Complaint
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <FiAlertCircle style={{ marginRight: '0.5rem' }} />
                  Category
                </label>
                <select
                  className="form-input"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map(cat => {
                    const Icon = cat.icon;
                    return (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Submit Complaint</button>
            </form>
          </motion.div>
        )}

        <div className="card">
          <h2 className="card-title">Complaint History</h2>
          {complaints.length > 0 ? (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Resolution Date</th>
                    <th>Resolution Time</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint._id}>
                      <td style={{ textTransform: 'capitalize' }}>{complaint.category}</td>
                      <td>{complaint.description}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td>{complaint.resolutionDate ? new Date(complaint.resolutionDate).toLocaleDateString() : '-'}</td>
                      <td>{complaint.resolutionTime || '-'}</td>
                      <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ textAlign: 'center', padding: '2rem' }}>No complaints found</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentComplaints;