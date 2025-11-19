// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
// import { FiUsers, FiAlertCircle, FiAlertTriangle, FiCalendar, FiTrendingUp } from 'react-icons/fi';
// import { HiOutlineUserCircle } from 'react-icons/hi';
// import Layout from '../../components/Layout';
// import { useAuth } from '../../context/AuthContext';
// import api from '../../services/api';
// import ChartDataProcessor from '../../utils/ChartDataProcessor';
// import '../../styles/App.css';

// const AdminDashboard = () => {
//   const { user } = useAuth();
//   const [stats, setStats] = useState({
//     totalStudents: 0,
//     totalComplaints: 0,
//     pendingComplaints: 0,
//     totalAttendance: 0,
//     pendingLeaves: 0
//   });
//   const [attendanceStats, setAttendanceStats] = useState([]);
//   const [complaints, setComplaints] = useState([]);
//   const [attendance, setAttendance] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const chartProcessor = new ChartDataProcessor();

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const [students, complaintsData, attendanceData, attendanceStatsData, leaves] = await Promise.all([
//         api.getAllStudents(),
//         api.getAllComplaints(),
//         api.getAllAttendance(),
//         api.getAttendanceStats(),
//         api.getAllMessLeaves()
//       ]);

//       setStats({
//         totalStudents: students.length,
//         totalComplaints: complaintsData.length,
//         pendingComplaints: complaintsData.filter(c => c.status === 'pending').length,
//         totalAttendance: attendanceData.length,
//         pendingLeaves: leaves.filter(l => l.status === 'pending').length
//       });

//       setComplaints(complaintsData);
//       setAttendance(attendanceData);
//       setAttendanceStats(attendanceStatsData);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const attendanceChartData = chartProcessor.processAttendanceData(attendance);
//   const complaintData = chartProcessor.processComplaintsByCategory(complaints);
//   const attendancePieData = chartProcessor.processStatsForPie(attendanceStats);

//   const COLORS = ['#4a90e2', '#28a745', '#ffc107', '#dc3545', '#6c757d', '#17a2b8'];

//   if (loading) {
//     return (
//       <Layout role="admin">
//         <div>Loading...</div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout role="admin">
//       <div className="container">
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <h1 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
//             <HiOutlineUserCircle size={40} style={{ color: 'var(--primary-color)' }} />
//             Welcome, {user?.name}!
//           </h1>
//         </motion.div>

//         {/* Stats Cards */}
//         <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
//           <motion.div 
//             className="stats-card"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.2 }}
//             whileHover={{ scale: 1.05 }}
//           >
//             <h3>
//               <FiUsers />
//               Total Students
//             </h3>
//             <p>{stats.totalStudents}</p>
//           </motion.div>
//           <motion.div 
//             className="stats-card success"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.3 }}
//             whileHover={{ scale: 1.05 }}
//           >
//             <h3>
//               <FiAlertCircle />
//               Total Complaints
//             </h3>
//             <p>{stats.totalComplaints}</p>
//           </motion.div>
//           <motion.div 
//             className="stats-card warning"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.4 }}
//             whileHover={{ scale: 1.05 }}
//           >
//             <h3>
//               <FiAlertTriangle />
//               Pending Complaints
//             </h3>
//             <p>{stats.pendingComplaints}</p>
//           </motion.div>
//           <motion.div 
//             className="stats-card danger"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.5 }}
//             whileHover={{ scale: 1.05 }}
//           >
//             <h3>
//               <FiCalendar />
//               Pending Leaves
//             </h3>
//             <p>{stats.pendingLeaves}</p>
//           </motion.div>
//         </div>

//         {/* Charts */}
//         <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
//           <motion.div 
//             className="card"
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.6 }}
//           >
//             <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//               <FiTrendingUp />
//               Attendance Trend (Last 30 Days)
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={attendanceChartData.labels.slice(-10).map((label, index) => ({
//                 date: label.split('-').slice(1).join('/'),
//                 present: attendanceChartData.present[index + attendanceChartData.present.length - 10] || 0,
//                 absent: attendanceChartData.absent[index + attendanceChartData.absent.length - 10] || 0
//               }))}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" tick={{ fontSize: 12 }} />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="present" stroke="#28a745" strokeWidth={2} />
//                 <Line type="monotone" dataKey="absent" stroke="#dc3545" strokeWidth={2} />
//               </LineChart>
//             </ResponsiveContainer>
//           </motion.div>

//           <motion.div 
//             className="card"
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.7 }}
//           >
//             <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//               <FiTrendingUp />
//               Attendance Overview
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={attendancePieData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {attendancePieData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <motion.div 
//           className="card"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.8 }}
//         >
//           <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//             <FiAlertCircle />
//             Complaints by Category
//           </h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={complaintData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="value" fill="#4a90e2" />
//             </BarChart>
//           </ResponsiveContainer>
//         </motion.div>

//         {/* Recent Complaints */}
//         <motion.div 
//           className="card" 
//           style={{ marginTop: '1.5rem' }}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.9 }}
//         >
//           <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//             <FiAlertCircle />
//             Recent Complaints
//           </h3>
//           <div className="table-wrapper">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Student ID</th>
//                   <th>Category</th>
//                   <th>Description</th>
//                   <th>Status</th>
//                   <th>Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {complaints.slice(0, 5).map((complaint) => (
//                   <tr key={complaint._id}>
//                     <td>{complaint.studentID}</td>
//                     <td style={{ textTransform: 'capitalize' }}>{complaint.category}</td>
//                     <td>{complaint.description.substring(0, 50)}...</td>
//                     <td>
//                       <span className={`badge badge-${complaint.status}`}>
//                         {complaint.status}
//                       </span>
//                     </td>
//                     <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </motion.div>
//       </div>
//     </Layout>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { FiUsers, FiAlertCircle, FiAlertTriangle, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import { HiOutlineUserCircle } from 'react-icons/hi';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import ChartDataProcessor from '../../utils/ChartDataProcessor';
import '../../styles/App.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    totalAttendance: 0,
    pendingLeaves: 0
  });
  const [attendanceStats, setAttendanceStats] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const chartProcessor = new ChartDataProcessor();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [students, complaintsData, attendanceData, attendanceStatsData, leaves] = await Promise.all([
        api.getAllStudents(),
        api.getAllComplaints(),
        api.getAllAttendance(),
        api.getAttendanceStats(),
        api.getAllMessLeaves()
      ]);

      setStats({
        totalStudents: students.length,
        totalComplaints: complaintsData.length,
        pendingComplaints: complaintsData.filter(c => c.status === 'pending').length,
        totalAttendance: attendanceData.length,
        pendingLeaves: leaves.filter(l => l.status === 'pending').length
      });

      setComplaints(complaintsData);
      setAttendance(attendanceData);
      setAttendanceStats(attendanceStatsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const attendanceChartData = chartProcessor.processAttendanceData(attendance);
  const complaintData = chartProcessor.processComplaintsByCategory(complaints);
  const attendancePieData = chartProcessor.processStatsForPie(attendanceStats);

  const COLORS = ['#4a90e2', '#28a745', '#ffc107', '#dc3545', '#6c757d', '#17a2b8'];

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

        {/* Stats Cards */}
        <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
          <motion.div 
            className="stats-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3>
              <FiUsers />
              Total Students
            </h3>
            <p>{stats.totalStudents}</p>
          </motion.div>
          <motion.div 
            className="stats-card success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3>
              <FiAlertCircle />
              Total Complaints
            </h3>
            <p>{stats.totalComplaints}</p>
          </motion.div>
          <motion.div 
            className="stats-card warning"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3>
              <FiAlertTriangle />
              Pending Complaints
            </h3>
            <p>{stats.pendingComplaints}</p>
          </motion.div>
          <motion.div 
            className="stats-card danger"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3>
              <FiCalendar />
              Pending Leaves
            </h3>
            <p>{stats.pendingLeaves}</p>
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
              <LineChart data={attendanceChartData.labels.slice(-10).map((label, index) => ({
                date: label.split('-').slice(1).join('/'),
                present: attendanceChartData.present[index + attendanceChartData.present.length - 10] || 0,
                absent: attendanceChartData.absent[index + attendanceChartData.absent.length - 10] || 0
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="present" stroke="#28a745" strokeWidth={2} />
                <Line type="monotone" dataKey="absent" stroke="#dc3545" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div 
            className="card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiTrendingUp />
              Attendance Overview
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendancePieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendancePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiAlertCircle />
            Complaints by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complaintData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#4a90e2" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Complaints */}
        <motion.div 
          className="card" 
          style={{ marginTop: '1.5rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiAlertCircle />
            Recent Complaints
          </h3>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {complaints.slice(0, 5).map((complaint) => (
                  <tr key={complaint._id}>
                    <td>{complaint.studentID}</td>
                    <td style={{ textTransform: 'capitalize' }}>{complaint.category}</td>
                    <td>{complaint.description.substring(0, 50)}...</td>
                    <td>
                      <span className={`badge badge-${complaint.status}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;