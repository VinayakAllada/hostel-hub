import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/App.css';

const AdminComplaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [resolutionData, setResolutionData] = useState({
    resolutionDate: '',
    resolutionTime: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const data = await api.getAllComplaints();
      setComplaints(data);
    } catch (error) {
      setMessage(error.message || 'Error fetching complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = (complaint) => {
    setSelectedComplaint(complaint);
    setShowAcceptModal(true);
  };

  const handleAcceptSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await api.acceptComplaint(
        selectedComplaint._id,
        resolutionData.resolutionDate,
        resolutionData.resolutionTime
      );
      setMessage('Complaint accepted and resolution date set!');
      setShowAcceptModal(false);
      setSelectedComplaint(null);
      setResolutionData({ resolutionDate: '', resolutionTime: '' });
      fetchComplaints();
    } catch (error) {
      setMessage(error.message || 'Error accepting complaint');
    }
  };

  const handleResolve = async (id) => {
    try {
      await api.resolveComplaint(id);
      setMessage('Complaint marked as resolved!');
      fetchComplaints();
    } catch (error) {
      setMessage(error.message || 'Error resolving complaint');
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
      <Layout role="admin">
        <div>Loading...</div>
      </Layout>
    );
  }

  const pendingComplaints = complaints.filter(c => c.status === 'pending');
  const acceptedComplaints = complaints.filter(c => c.status === 'accepted');

  return (
    <Layout role="admin">
      <div className="container">
        <h1 style={{ marginBottom: '2rem' }}>Complaint Management</h1>

        {message && (
          <div className="card" style={{ 
            marginBottom: '1.5rem',
            backgroundColor: message.includes('successfully') || message.includes('resolved') ? 'var(--success-color)' : 'var(--danger-color)',
            color: 'white',
            padding: '1rem'
          }}>
            {message}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
          <div className="stats-card">
            <h3>Total Complaints</h3>
            <p>{complaints.length}</p>
          </div>
          <div className="stats-card" style={{ background: 'linear-gradient(135deg, #ffc107, #ff9800)' }}>
            <h3>Pending</h3>
            <p>{pendingComplaints.length}</p>
          </div>
          <div className="stats-card" style={{ background: 'linear-gradient(135deg, #28a745, #20c997)' }}>
            <h3>Accepted</h3>
            <p>{acceptedComplaints.length}</p>
          </div>
        </div>

        {/* All Complaints */}
        <div className="card">
          <h2 className="card-title">All Complaints</h2>
          {complaints.length > 0 ? (
            <div className="table-wrapper">
              <table className="table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Room</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Resolution Date</th>
                  <th>Resolution Time</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint._id}>
                    <td>{complaint.studentID}</td>
                    <td>{complaint.roomNO}</td>
                    <td style={{ textTransform: 'capitalize' }}>{complaint.category}</td>
                    <td>{complaint.description.substring(0, 50)}...</td>
                    <td>
                      <span className={`badge ${getStatusBadge(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td>{complaint.resolutionDate ? new Date(complaint.resolutionDate).toLocaleDateString() : '-'}</td>
                    <td>{complaint.resolutionTime || '-'}</td>
                    <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                    <td>
                      {complaint.status === 'pending' && (
                        <button
                          className="btn btn-success"
                          onClick={() => handleAccept(complaint)}
                          style={{ marginRight: '0.5rem' }}
                        >
                          Accept
                        </button>
                      )}
                      {complaint.status === 'accepted' && (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleResolve(complaint._id)}
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          ) : (
            <p style={{ textAlign: 'center', padding: '2rem' }}>No complaints found</p>
          )}
        </div>

        {/* Accept Modal */}
        {showAcceptModal && selectedComplaint && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}>
            <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
              <h2 className="card-title">Accept Complaint</h2>
              <p><strong>Student:</strong> {selectedComplaint.studentID}</p>
              <p><strong>Category:</strong> {selectedComplaint.category}</p>
              <p><strong>Description:</strong> {selectedComplaint.description}</p>
              
              <form onSubmit={handleAcceptSubmit} style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Resolution Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={resolutionData.resolutionDate}
                    onChange={(e) => setResolutionData({ ...resolutionData, resolutionDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Resolution Time</label>
                  <input
                    type="time"
                    className="form-input"
                    value={resolutionData.resolutionTime}
                    onChange={(e) => setResolutionData({ ...resolutionData, resolutionTime: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-success">Accept & Set Resolution</button>
                  <button type="button" className="btn btn-danger" onClick={() => {
                    setShowAcceptModal(false);
                    setSelectedComplaint(null);
                    setResolutionData({ resolutionDate: '', resolutionTime: '' });
                  }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminComplaints;

