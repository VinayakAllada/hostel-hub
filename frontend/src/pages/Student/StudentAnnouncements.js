import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/App.css';

const StudentAnnouncements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const data = await api.getMyInvoices();
      setAnnouncements(data);
    } catch (error) {
      setMessage(error.message || 'Error fetching announcements');
    } finally {
      setLoading(false);
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
        <h1 style={{ marginBottom: '2rem' }}>Announcements</h1>

        {message && (
          <div className="card" style={{ 
            marginBottom: '1.5rem',
            backgroundColor: 'var(--danger-color)',
            color: 'white',
            padding: '1rem'
          }}>
            {message}
          </div>
        )}

        <div className="card">
          <h2 className="card-title">All Announcements</h2>
          {announcements.length > 0 ? (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.map((announcement) => (
                    <tr key={announcement._id}>
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

export default StudentAnnouncements;

