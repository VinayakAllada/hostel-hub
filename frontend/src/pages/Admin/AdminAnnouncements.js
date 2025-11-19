import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/App.css';

const AdminAnnouncements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const data = await api.getAllInvoices();
      setAnnouncements(data);
    } catch (error) {
      setMessage(error.message || 'Error fetching announcements');
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

    if (!formData.title || !formData.description) {
      setMessage('Please fill all fields');
      return;
    }

    try {
      await api.generateInvoice({
        title: formData.title,
        description: formData.description
      });
      setMessage('Announcement sent to all students successfully!');
      setFormData({ title: '', description: '' });
      setShowForm(false);
      fetchAnnouncements();
    } catch (error) {
      setMessage(error.message || 'Error creating announcement');
    }
  };

  if (loading) {
    return (
      <Layout role="admin">
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout role="admin">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1>Announcement Management</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Create Announcement'}
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

        {/* Stats */}
        <div className="stats-card" style={{ marginBottom: '2rem' }}>
          <h3>Total Announcements</h3>
          <p>{announcements.length}</p>
        </div>

        {/* Create Announcement Form */}
        {showForm && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 className="card-title">Create Announcement for All Students</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-input"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-input"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">Send to All Students</button>
            </form>
          </div>
        )}

        {/* All Announcements */}
        <div className="card">
          <h2 className="card-title">All Announcements</h2>
          {announcements.length > 0 ? (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.map((announcement) => (
                    <tr key={announcement._id}>
                      <td>{announcement.invoiceID}</td>
                      <td><strong>{announcement.title}</strong></td>
                      <td>{announcement.description}</td>
                      <td>{new Date(announcement.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ textAlign: 'center', padding: '2rem' }}>No announcements found</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminAnnouncements;

