import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/App.css';

const StudentInvoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await api.getMyInvoices();
      setInvoices(data);
    } catch (error) {
      setMessage(error.message || 'Error fetching invoices');
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
        <h1 style={{ marginBottom: '2rem' }}>Invoices</h1>

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
          <h2 className="card-title">All Invoices</h2>
          {invoices.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td>{invoice.invoiceID}</td>
                    <td>{invoice.title}</td>
                    <td>{invoice.description}</td>
                    <td>₹{invoice.amount}</td>
                    <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${invoice.status}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center', padding: '2rem' }}>No invoices found</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentInvoices;

