import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/App.css';

const AdminMessLeave = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const data = await api.getAllMessLeaves();
      setLeaves(data);
    } catch (error) {
      setMessage(error.message || 'Error fetching mess leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.approveMessLeave(id);
      setMessage('Mess leave approved successfully!');
      fetchLeaves();
    } catch (error) {
      setMessage(error.message || 'Error approving mess leave');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this mess leave?')) {
      return;
    }
    try {
      await api.rejectMessLeave(id);
      setMessage('Mess leave rejected!');
      fetchLeaves();
    } catch (error) {
      setMessage(error.message || 'Error rejecting mess leave');
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

  if (loading) {
    return (
      <Layout role="admin">
        <div>Loading...</div>
      </Layout>
    );
  }

  const pendingLeaves = leaves.filter(l => l.status === 'pending');
  const approvedLeaves = leaves.filter(l => l.status === 'approved');

  // Calculate total absent days
  const totalAbsentDays = approvedLeaves.reduce((sum, leave) => sum + leave.numberOfDays, 0);

  return (
    <Layout role="admin">
      <div className="container">
        <h1 style={{ marginBottom: '2rem' }}>Mess Leave Management</h1>

        {message && (
          <div className="card" style={{ 
            marginBottom: '1.5rem',
            backgroundColor: message.includes('successfully') || message.includes('approved') ? 'var(--success-color)' : 'var(--danger-color)',
            color: 'white',
            padding: '1rem'
          }}>
            {message}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
          <div className="stats-card">
            <h3>Total Leaves</h3>
            <p>{leaves.length}</p>
          </div>
          <div className="stats-card" style={{ background: 'linear-gradient(135deg, #ffc107, #ff9800)' }}>
            <h3>Pending</h3>
            <p>{pendingLeaves.length}</p>
          </div>
          <div className="stats-card" style={{ background: 'linear-gradient(135deg, #28a745, #20c997)' }}>
            <h3>Total Absent Days</h3>
            <p>{totalAbsentDays}</p>
          </div>
        </div>

        {/* Pending Leaves */}
        {pendingLeaves.length > 0 && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 className="card-title">Pending Leaves ({pendingLeaves.length})</h2>
            <div className="table-wrapper">
              <table className="table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Room</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Applied On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingLeaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>{leave.studentID}</td>
                    <td>{leave.studentName}</td>
                    <td>{leave.roomNO}</td>
                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td>{leave.numberOfDays}</td>
                    <td>{leave.reason}</td>
                    <td>{new Date(leave.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() => handleApprove(leave._id)}
                        style={{ marginRight: '0.5rem' }}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleReject(leave._id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>
        )}

        {/* All Leaves */}
        <div className="card">
          <h2 className="card-title">All Leave Applications</h2>
          {leaves.length > 0 ? (
            <div className="table-wrapper">
              <table className="table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Room</th>
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
                    <td>{leave.studentID}</td>
                    <td>{leave.studentName}</td>
                    <td>{leave.roomNO}</td>
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

export default AdminMessLeave;

