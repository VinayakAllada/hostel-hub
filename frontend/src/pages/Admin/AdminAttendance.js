// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// import { FiClipboard, FiInfo, FiX, FiCheckCircle, FiXCircle, FiUser, FiCalendar } from 'react-icons/fi';
// import { HiOutlineUserCircle } from 'react-icons/hi';
// import Layout from '../../components/Layout';
// import { useAuth } from '../../context/AuthContext';
// import api from '../../services/api';
// import ChartDataProcessor from '../../utils/ChartDataProcessor';
// import '../../styles/App.css';

// const AdminAttendance = () => {
//   const { user } = useAuth();
//   const [students, setStudents] = useState([]);
//   const [selectedStudent, setSelectedStudent] = useState('');
//   const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
//   const [status, setStatus] = useState('present');
//   const [allAttendance, setAllAttendance] = useState([]);
//   const [showStudentChart, setShowStudentChart] = useState(false);
//   const [selectedStudentData, setSelectedStudentData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('');

//   const chartProcessor = new ChartDataProcessor();
//   const COLORS = ['#28a745', '#dc3545'];

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const [studentsData, attendanceData] = await Promise.all([
//         api.getAllStudents(),
//         api.getAllAttendance()
//       ]);

//       setStudents(studentsData);
//       setAllAttendance(attendanceData);
//     } catch (error) {
//       setMessage(error.message || 'Error fetching data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');

//     if (!selectedStudent) {
//       setMessage('Please select a student');
//       return;
//     }

//     try {
//       await api.recordAttendance({
//         studentID: selectedStudent,
//         date,
//         status
//       });
//       setMessage('Attendance recorded successfully!');
//       setSelectedStudent('');
//       fetchData();
//     } catch (error) {
//       setMessage(error.message || 'Error recording attendance');
//     }
//   };

//   const handleViewStudentChart = async (studentID) => {
//     try {
//       const studentAttendance = allAttendance.filter(a => a.studentID === studentID);
//       const student = students.find(s => s.studentID === studentID);
      
//       if (studentAttendance.length === 0) {
//         setMessage('No attendance data found for this student');
//         return;
//       }

//       setSelectedStudentData({
//         student,
//         attendance: studentAttendance
//       });
//       setShowStudentChart(true);
//     } catch (error) {
//       setMessage(error.message || 'Error loading student data');
//     }
//   };

//   const getStudentStats = (studentID) => {
//     const studentAttendance = allAttendance.filter(a => a.studentID === studentID);
//     const present = studentAttendance.filter(a => a.status === 'present').length;
//     const absent = studentAttendance.filter(a => a.status === 'absent').length;
//     const total = studentAttendance.length;
//     const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    
//     return { present, absent, total, percentage };
//   };

//   if (loading) {
//     return (
//       <Layout role="admin">
//         <div>Loading...</div>
//       </Layout>
//     );
//   }

//   const studentChartData = selectedStudentData 
//     ? chartProcessor.processAttendanceData(selectedStudentData.attendance)
//     : null;

//   const studentPieData = selectedStudentData
//     ? [
//         { name: 'Present', value: getStudentStats(selectedStudentData.student.studentID).present },
//         { name: 'Absent', value: getStudentStats(selectedStudentData.student.studentID).absent }
//       ]
//     : [];

//   return (
//     <Layout role="admin">
//       <div className="container">
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <h1 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
//             <FiClipboard style={{ color: 'var(--primary-color)' }} size={40} />
//             Attendance Management
//           </h1>
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

//         {/* Record Attendance Form */}
//         <motion.div 
//           className="card" 
//           style={{ marginBottom: '2rem' }}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//         >
//           <h2 className="card-title">
//             <FiCheckCircle />
//             Record Attendance
//           </h2>
//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-3">
//               <div className="form-group">
//                 <label className="form-label">
//                   <FiUser style={{ marginRight: '0.5rem' }} />
//                   Student
//                 </label>
//                 <select
//                   className="form-input"
//                   value={selectedStudent}
//                   onChange={(e) => setSelectedStudent(e.target.value)}
//                   required
//                 >
//                   <option value="">Select Student</option>
//                   {students.map(student => (
//                     <option key={student._id} value={student.studentID}>
//                       {student.studentID} - {student.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label className="form-label">
//                   <FiCalendar style={{ marginRight: '0.5rem' }} />
//                   Date
//                 </label>
//                 <input
//                   type="date"
//                   className="form-input"
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label className="form-label">
//                   <FiCheckCircle style={{ marginRight: '0.5rem' }} />
//                   Status
//                 </label>
//                 <select
//                   className="form-input"
//                   value={status}
//                   onChange={(e) => setStatus(e.target.value)}
//                   required
//                 >
//                   <option value="present">Present</option>
//                   <option value="absent">Absent</option>
//                 </select>
//               </div>
//             </div>
//             <motion.button 
//               type="submit" 
//               className="btn btn-primary"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <FiCheckCircle />
//               Record Attendance
//             </motion.button>
//           </form>
//         </div>

//         {/* Students List */}
//         <motion.div 
//           className="card"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//         >
//           <h2 className="card-title">
//             <FiUser />
//             Students ({students.length})
//           </h2>
//           <div className="table-wrapper">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Student ID</th>
//                   <th>Name</th>
//                   <th>Room</th>
//                   <th>Present</th>
//                   <th>Absent</th>
//                   <th>Total</th>
//                   <th>Percentage</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {students.map((student) => {
//                   const stats = getStudentStats(student.studentID);
//                   return (
//                     <tr key={student._id}>
//                       <td>{student.studentID}</td>
//                       <td>{student.name}</td>
//                       <td>{student.roomNO}</td>
//                       <td>{stats.present}</td>
//                       <td>{stats.absent}</td>
//                       <td>{stats.total}</td>
//                       <td>{stats.percentage}%</td>
//                       <td>
//                         <motion.button
//                           className="btn btn-primary"
//                           onClick={() => handleViewStudentChart(student.studentID)}
//                           style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
//                           whileHover={{ scale: 1.05 }}
//                           whileTap={{ scale: 0.95 }}
//                         >
//                           <FiInfo />
//                           Info
//                         </motion.button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </motion.div>

//         {/* Student Chart Modal */}
//         <AnimatePresence>
//           {showStudentChart && selectedStudentData && (
//             <motion.div 
//               style={{
//                 position: 'fixed',
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 backgroundColor: 'rgba(0, 0, 0, 0.7)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 zIndex: 10000,
//                 padding: '1rem'
//               }} 
//               onClick={() => setShowStudentChart(false)}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               <motion.div 
//                 className="card" 
//                 style={{ 
//                   maxWidth: '900px', 
//                   width: '100%', 
//                   maxHeight: '90vh', 
//                   overflowY: 'auto',
//                   position: 'relative'
//                 }} 
//                 onClick={(e) => e.stopPropagation()}
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ type: "spring", stiffness: 300, damping: 30 }}
//               >
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
//                   <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                     <HiOutlineUserCircle size={32} />
//                     Attendance Charts - {selectedStudentData.student.name} ({selectedStudentData.student.studentID})
//                   </h2>
//                   <motion.button 
//                     className="btn btn-danger" 
//                     onClick={() => setShowStudentChart(false)}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <FiX />
//                     Close
//                   </motion.button>
//                 </div>

//               {studentChartData && (
//                 <>
//                   <div className="card" style={{ marginBottom: '2rem' }}>
//                     <h3 className="card-title">Attendance Trend (Last 30 Days)</h3>
//                     <ResponsiveContainer width="100%" height={300}>
//                       <BarChart data={studentChartData.labels.slice(-30).map((label, index) => {
//                         const idx = studentChartData.labels.length - 30 + index;
//                         return {
//                           date: label.split('-').slice(1).join('/'),
//                           present: studentChartData.present[idx] || 0,
//                           absent: studentChartData.absent[idx] || 0
//                         };
//                       })}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="date" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Bar dataKey="present" fill="#28a745" />
//                         <Bar dataKey="absent" fill="#dc3545" />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>

//                   <div className="card">
//                     <h3 className="card-title">Attendance Overview</h3>
//                     <ResponsiveContainer width="100%" height={300}>
//                       <PieChart>
//                         <Pie
//                           data={studentPieData}
//                           cx="50%"
//                           cy="50%"
//                           labelLine={false}
//                           label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                           outerRadius={100}
//                           fill="#8884d8"
//                           dataKey="value"
//                         >
//                           {studentPieData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                           ))}
//                         </Pie>
//                         <Tooltip />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </>
//               )}
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </Layout>
//   );
// };

// export default AdminAttendance;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiClipboard, FiInfo, FiX, FiCheckCircle, FiXCircle, FiUser, FiCalendar } from 'react-icons/fi';
import { HiOutlineUserCircle } from 'react-icons/hi';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import ChartDataProcessor from '../../utils/ChartDataProcessor';
import '../../styles/App.css';

const AdminAttendance = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('present');
  const [allAttendance, setAllAttendance] = useState([]);
  const [showStudentChart, setShowStudentChart] = useState(false);
  const [selectedStudentData, setSelectedStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const chartProcessor = new ChartDataProcessor();
  const COLORS = ['#28a745', '#dc3545'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsData, attendanceData] = await Promise.all([
        api.getAllStudents(),
        api.getAllAttendance()
      ]);

      setStudents(studentsData);
      setAllAttendance(attendanceData);
    } catch (error) {
      setMessage(error.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!selectedStudent) {
      setMessage('Please select a student');
      return;
    }

    try {
      await api.recordAttendance({
        studentID: selectedStudent,
        date,
        status
      });
      setMessage('Attendance recorded successfully!');
      setSelectedStudent('');
      fetchData();
    } catch (error) {
      setMessage(error.message || 'Error recording attendance');
    }
  };

  const handleViewStudentChart = async (studentID) => {
    try {
      const studentAttendance = allAttendance.filter(a => a.studentID === studentID);
      const student = students.find(s => s.studentID === studentID);
      
      if (studentAttendance.length === 0) {
        setMessage('No attendance data found for this student');
        return;
      }

      setSelectedStudentData({
        student,
        attendance: studentAttendance
      });
      setShowStudentChart(true);
    } catch (error) {
      setMessage(error.message || 'Error loading student data');
    }
  };

  const getStudentStats = (studentID) => {
    const studentAttendance = allAttendance.filter(a => a.studentID === studentID);
    const present = studentAttendance.filter(a => a.status === 'present').length;
    const absent = studentAttendance.filter(a => a.status === 'absent').length;
    const total = studentAttendance.length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    
    return { present, absent, total, percentage };
  };

  if (loading) {
    return (
      <Layout role="admin">
        <div>Loading...</div>
      </Layout>
    );
  }

  const studentChartData = selectedStudentData 
    ? chartProcessor.processAttendanceData(selectedStudentData.attendance)
    : null;

  const studentPieData = selectedStudentData
    ? [
        { name: 'Present', value: getStudentStats(selectedStudentData.student.studentID).present },
        { name: 'Absent', value: getStudentStats(selectedStudentData.student.studentID).absent }
      ]
    : [];

  return (
    <Layout role="admin">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <FiClipboard style={{ color: 'var(--primary-color)' }} size={40} />
            Attendance Management
          </h1>
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

        {/* Record Attendance Form */}
        <motion.div 
          className="card" 
          style={{ marginBottom: '2rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="card-title">
            <FiCheckCircle />
            Record Attendance
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-3">
              <div className="form-group">
                <label className="form-label">
                  <FiUser style={{ marginRight: '0.5rem' }} />
                  Student
                </label>
                <select
                  className="form-input"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  required
                >
                  <option value="">Select Student</option>
                  {students.map(student => (
                    <option key={student._id} value={student.studentID}>
                      {student.studentID} - {student.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">
                  <FiCalendar style={{ marginRight: '0.5rem' }} />
                  Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <FiCheckCircle style={{ marginRight: '0.5rem' }} />
                  Status
                </label>
                <select
                  className="form-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
            </div>
            <motion.button 
              type="submit" 
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiCheckCircle />
              Record Attendance
            </motion.button>
          </form>
        </motion.div>

        {/* Students List */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="card-title">
            <FiUser />
            Students ({students.length})
          </h2>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Room</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Total</th>
                  <th>Percentage</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const stats = getStudentStats(student.studentID);
                  return (
                    <tr key={student._id}>
                      <td>{student.studentID}</td>
                      <td>{student.name}</td>
                      <td>{student.roomNO}</td>
                      <td>{stats.present}</td>
                      <td>{stats.absent}</td>
                      <td>{stats.total}</td>
                      <td>{stats.percentage}%</td>
                      <td>
                        <motion.button
                          className="btn btn-primary"
                          onClick={() => handleViewStudentChart(student.studentID)}
                          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiInfo />
                          Info
                        </motion.button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Student Chart Modal */}
        <AnimatePresence>
          {showStudentChart && selectedStudentData && (
            <motion.div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                padding: '1rem'
              }} 
              onClick={() => setShowStudentChart(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="card" 
                style={{ 
                  maxWidth: '900px', 
                  width: '100%', 
                  maxHeight: '90vh', 
                  overflowY: 'auto',
                  position: 'relative'
                }} 
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <HiOutlineUserCircle size={32} />
                    Attendance Charts - {selectedStudentData.student.name} ({selectedStudentData.student.studentID})
                  </h2>
                  <motion.button 
                    className="btn btn-danger" 
                    onClick={() => setShowStudentChart(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiX />
                    Close
                  </motion.button>
                </div>

                {studentChartData && (
                  <>
                    <div className="card" style={{ marginBottom: '2rem' }}>
                      <h3 className="card-title">Attendance Trend (Last 30 Days)</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={studentChartData.labels.slice(-30).map((label, index) => {
                          const idx = studentChartData.labels.length - 30 + index;
                          return {
                            date: label.split('-').slice(1).join('/'),
                            present: studentChartData.present[idx] || 0,
                            absent: studentChartData.absent[idx] || 0
                          };
                        })}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="present" fill="#28a745" />
                          <Bar dataKey="absent" fill="#dc3545" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="card">
                      <h3 className="card-title">Attendance Overview</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={studentPieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {studentPieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default AdminAttendance;