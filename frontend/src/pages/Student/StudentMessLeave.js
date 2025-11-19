import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/App.css';

const StudentMessLeave = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const data = await api.getMyMessLeaves();
      setLeaves(data);
    } catch (error) {
      setMessage(error.message || 'Error fetching mess leaves');
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

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setMessage('End date must be after start date');
      return;
    }

    try {
      await api.applyMessLeave(formData);
      setMessage('Mess leave application submitted successfully!');
      setFormData({ startDate: '', endDate: '', reason: '' });
      setShowForm(false);
      fetchLeaves();
    } catch (error) {
      setMessage(error.message || 'Error submitting mess leave');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-pending',
      approved: 'badge-approved',
      rejected: 'badge-rejected'
    };
    return badges[status] || 'badge-pending';
  };

  const approvedLeaves = leaves.filter(leave => leave.status === 'approved');

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Mess Leave</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Apply for Leave'}
          </button>
        </div>

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
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 className="card-title">Apply for Mess Leave</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-input"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-input"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Reason</label>
                <textarea
                  className="form-input"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows="4"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Submit Application</button>
            </form>
          </div>
        )}

        {approvedLeaves.length > 0 && (
          <div className="card" style={{ marginBottom: '2rem',  color: 'white' }}>
            <h2 className="card-title">Approved Leaves</h2>
            <p>Total Approved Days: {approvedLeaves.reduce((sum, leave) => sum + leave.numberOfDays, 0)}</p>
            <div className="table-wrapper">
              <table className="table" style={{ color: 'white', marginTop: '1rem' }}>
                <thead>
                  <tr>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Days</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedLeaves.map((leave) => (
                    <tr key={leave._id}>
                      <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                      <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                      <td>{leave.numberOfDays}</td>
                      <td>{leave.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="card">
          <h2 className="card-title">Leave Applications</h2>
          {leaves.length > 0 ? (
            <div className="table-wrapper">
              <table className="table">
              <thead>
                <tr>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Applied On</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td>{leave.numberOfDays}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td>{new Date(leave.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          ) : (
            <p style={{ textAlign: 'center', padding: '2rem' }}>No leave applications found</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentMessLeave;

