import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { FiTrendingUp, FiAlertCircle, FiCalendar, FiBell } from 'react-icons/fi';
import { HiOutlineUserCircle, HiOutlineTrendingUp } from 'react-icons/hi';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import NotificationManager from '../../utils/NotificationManager';
import ChartDataProcessor from '../../utils/ChartDataProcessor';
import '../../styles/App.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [messLeaves, setMessLeaves] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const chartProcessor = new ChartDataProcessor();

  useEffect(() => {
    // Register callback for notifications
    NotificationManager.onNotificationChange((notifications) => {
      setNotifications(notifications);
    });

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [attendanceData, complaintsData, invoicesData, leavesData] = await Promise.all([
        api.getMyAttendance(),
        api.getMyComplaints(),
        api.getMyInvoices(),
        api.getMyMessLeaves()
      ]);

      setAttendance(attendanceData);
      setComplaints(complaintsData);
      setInvoices(invoicesData);
      setMessLeaves(leavesData);

      // Add notifications for recent admin messages (invoices)
      if (invoicesData && invoicesData.length > 0) {
        invoicesData.slice(0, 3).forEach(invoice => {
          NotificationManager.add({
            id: Date.now() + Math.random(),
            type: 'invoice',
            message: `New invoice: ${invoice.title}`,
            timestamp: new Date()
          });
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const attendanceChartData = chartProcessor.processAttendanceData(attendance);
  const complaintData = chartProcessor.processComplaintsByCategory(complaints);

  const COLORS = ['#4a90e2', '#28a745', '#ffc107', '#dc3545', '#6c757d', '#17a2b8'];

  const recentInvoices = invoices.slice(0, 5);
  const approvedLeaves = messLeaves.filter(leave => leave.status === 'approved');

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
            Welcome, {user?.name}!
          </h1>
        </motion.div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <motion.div 
            className="card" 
            style={{ marginBottom: '2rem' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiBell />
              Recent Notifications
            </h3>
            {notifications.slice(0, 5).map((notif, index) => (
              <motion.div 
                key={notif.id} 
                style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {notif.message}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
          <motion.div 
            className="stats-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3>
              <FiTrendingUp />
              Total Attendance
            </h3>
            <p>{attendance.length}</p>
          </motion.div>
          <motion.div 
            className="stats-card success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3>
              <FiAlertCircle />
              Active Complaints
            </h3>
            <p>{complaints.filter(c => c.status !== 'resolved').length}</p>
          </motion.div>
          <motion.div 
            className="stats-card warning"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3>
              <FiCalendar />
              Mess Leave Days
            </h3>
            <p>{approvedLeaves.reduce((sum, leave) => sum + leave.numberOfDays, 0)}</p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
          <motion.div 
            className="card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiTrendingUp />
              Attendance Trend (Last 30 Days)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceChartData.labels.map((label, index) => ({
                date: label,
                present: attendanceChartData.present[index],
                absent: attendanceChartData.absent[index]
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#28a745" />
                <Bar dataKey="absent" fill="#dc3545" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div 
            className="card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiAlertCircle />
              Complaints by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={complaintData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {complaintData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Announcements */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiBell />
            Recent Announcements
          </h3>
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
              {recentInvoices.length > 0 ? (
                recentInvoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td><strong>{invoice.title}</strong></td>
                    <td>{invoice.description}</td>
                    <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>No announcements found</td>
                </tr>
              )}
            </tbody>
            </table>
          </div>
        </motion.div>

        {/* Approved Mess Leaves */}
        {approvedLeaves.length > 0 && (
          <motion.div 
            className="card" 
            style={{ marginTop: '1.5rem' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiCalendar />
              Approved Mess Leaves
            </h3>
            <div className="table-wrapper">
              <table className="table">
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
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default StudentDashboard;

