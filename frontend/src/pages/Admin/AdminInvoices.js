import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/App.css';

const AdminInvoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    dueDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await api.getAllInvoices();
      setInvoices(data);
    } catch (error) {
      setMessage(error.message || 'Error fetching invoices');
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

    if (!formData.title || !formData.description || !formData.amount || !formData.dueDate) {
      setMessage('Please fill all fields');
      return;
    }

    try {
      await api.generateInvoice({
        title: formData.title,
        description: formData.description,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate
      });
      setMessage('Invoice generated and sent to all students successfully!');
      setFormData({ title: '', description: '', amount: '', dueDate: '' });
      setShowForm(false);
      fetchInvoices();
    } catch (error) {
      setMessage(error.message || 'Error generating invoice');
    }
  };

  if (loading) {
    return (
      <Layout role="admin">
        <div>Loading...</div>
      </Layout>
    );
  }

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = invoices.filter(i => i.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <Layout role="admin">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Invoice Management</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Generate Invoice'}
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
        <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
          <div className="stats-card">
            <h3>Total Invoices</h3>
            <p>{invoices.length}</p>
          </div>
          <div className="stats-card" style={{ background: 'linear-gradient(135deg, #28a745, #20c997)' }}>
            <h3>Total Amount</h3>
            <p>₹{totalAmount.toFixed(2)}</p>
          </div>
          <div className="stats-card" style={{ background: 'linear-gradient(135deg, #ffc107, #ff9800)' }}>
            <h3>Pending Amount</h3>
            <p>₹{pendingAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Generate Invoice Form */}
        {showForm && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 className="card-title">Generate Invoice for All Students</h2>
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
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Amount (₹) *</label>
                  <input
                    type="number"
                    className="form-input"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-success">Generate & Send to All Students</button>
            </form>
          </div>
        )}

        {/* All Invoices */}
        <div className="card">
          <h2 className="card-title">All Invoices</h2>
          {invoices.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Student ID</th>
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
                    <td>{invoice.studentID || 'All Students'}</td>
                    <td>{invoice.title}</td>
                    <td>{invoice.description.substring(0, 50)}...</td>
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

export default AdminInvoices;

