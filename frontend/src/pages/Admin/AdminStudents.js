import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/App.css';

const AdminStudents = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await api.getAllStudents();
      setStudents(data);
    } catch (error) {
      setMessage(error.message || 'Error fetching students');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentClick = async (studentID) => {
    setLoadingDetails(true);
    setSelectedStudent(studentID);
    try {
      const data = await api.getStudentDetails(studentID);
      setStudentDetails(data);
    } catch (error) {
      setMessage(error.message || 'Error fetching student details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeDetails = () => {
    setSelectedStudent(null);
    setStudentDetails(null);
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
        <h1 style={{ marginBottom: '2rem' }}>Student List</h1>

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
          <h2 className="card-title">All Students ({students.length})</h2>
          {students.length > 0 ? (
            <div className="table-wrapper">
              <table className="table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Room Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.studentID}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.roomNO}</td>
                    <td>
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleStudentClick(student.studentID)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          ) : (
            <p style={{ textAlign: 'center', padding: '2rem' }}>No students found</p>
          )}
        </div>

        {/* Student Details Modal */}
        {selectedStudent && (
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
            <div className="card" style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className="card-title">Student Details</h2>
                <button className="btn btn-danger" onClick={closeDetails}>Close</button>
              </div>

              {loadingDetails ? (
                <div>Loading...</div>
              ) : studentDetails ? (
                <div>
                  {/* Basic Info */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h3>Basic Information</h3>
                    <p><strong>Student ID:</strong> {studentDetails.student.studentID}</p>
                    <p><strong>Name:</strong> {studentDetails.student.name}</p>
                    <p><strong>Email:</strong> {studentDetails.student.email}</p>
                    <p><strong>Room Number:</strong> {studentDetails.student.roomNO}</p>
                  </div>

                  {/* Complaints */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h3>Complaints ({studentDetails.complaints.length})</h3>
                    {studentDetails.complaints.length > 0 ? (
                      <div className="table-wrapper">
                        <table className="table">
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentDetails.complaints.map((complaint) => (
                            <tr key={complaint._id}>
                              <td style={{ textTransform: 'capitalize' }}>{complaint.category}</td>
                              <td>{complaint.description}</td>
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
                    ) : (
                      <p>No complaints</p>
                    )}
                  </div>

                  {/* Attendance */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h3>Attendance ({studentDetails.attendance.length})</h3>
                    <p>Present: {studentDetails.attendance.filter(a => a.status === 'present').length}</p>
                    <p>Absent: {studentDetails.attendance.filter(a => a.status === 'absent').length}</p>
                    {studentDetails.attendance.length > 0 && (
                      <div className="table-wrapper">
                        <table className="table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentDetails.attendance.slice(0, 10).map((attendance) => (
                            <tr key={attendance._id}>
                              <td>{new Date(attendance.date).toLocaleDateString()}</td>
                              <td>
                                <span className={`badge badge-${attendance.status}`}>
                                  {attendance.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Mess Leaves */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h3>Mess Leaves ({studentDetails.messLeaves.length})</h3>
                    {studentDetails.messLeaves.length > 0 ? (
                      <div className="table-wrapper">
                        <table className="table">
                        <thead>
                          <tr>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Days</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentDetails.messLeaves.map((leave) => (
                            <tr key={leave._id}>
                              <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                              <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                              <td>{leave.numberOfDays}</td>
                              <td>
                                <span className={`badge badge-${leave.status}`}>
                                  {leave.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        </table>
                      </div>
                    ) : (
                      <p>No mess leaves</p>
                    )}
                  </div>

                  {/* Announcements */}
                  <div>
                    <h3>Announcements ({studentDetails.invoices.filter(i => i.isBroadcast).length})</h3>
                    {studentDetails.invoices.filter(i => i.isBroadcast).length > 0 ? (
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
                          {studentDetails.invoices.filter(i => i.isBroadcast).map((announcement) => (
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
                      <p>No announcements</p>
                    )}
                  </div>
                </div>
              ) : (
                <div>No details available</div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminStudents;

