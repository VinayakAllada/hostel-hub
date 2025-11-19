const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Auth endpoints
  async studentRegister(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async studentLogin(studentID, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ studentID, password }),
    });
  }

  async adminLogin(adminID, password) {
    return this.request('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ adminID, password }),
    });
  }

  // Student endpoints
  async getStudentProfile() {
    return this.request('/students/profile');
  }

  async updateStudentProfile(profileData) {
    return this.request('/students/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(currentPassword, newPassword) {
    return this.request('/students/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Complaint endpoints
  async createComplaint(complaintData) {
    return this.request('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData),
    });
  }

  async getMyComplaints() {
    return this.request('/complaints/my-complaints');
  }

  async getAllComplaints() {
    return this.request('/complaints/all');
  }

  async acceptComplaint(id, resolutionDate, resolutionTime) {
    return this.request(`/complaints/${id}/accept`, {
      method: 'PUT',
      body: JSON.stringify({ resolutionDate, resolutionTime }),
    });
  }

  async resolveComplaint(id) {
    return this.request(`/complaints/${id}/resolve`, {
      method: 'PUT',
    });
  }

  // Attendance endpoints
  async getMyAttendance() {
    return this.request('/attendance/my-attendance');
  }

  async recordAttendance(attendanceData) {
    return this.request('/attendance/record', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  }

  async getAllAttendance() {
    return this.request('/attendance/all');
  }

  async getAttendanceStats() {
    return this.request('/attendance/stats');
  }

  // Mess Leave endpoints
  async applyMessLeave(leaveData) {
    return this.request('/mess-leave/apply', {
      method: 'POST',
      body: JSON.stringify(leaveData),
    });
  }

  async getMyMessLeaves() {
    return this.request('/mess-leave/my-leaves');
  }

  async getAllMessLeaves() {
    return this.request('/mess-leave/all');
  }

  async approveMessLeave(id) {
    return this.request(`/mess-leave/${id}/approve`, {
      method: 'PUT',
    });
  }

  async rejectMessLeave(id) {
    return this.request(`/mess-leave/${id}/reject`, {
      method: 'PUT',
    });
  }

  // Invoice endpoints
  async getMyInvoices() {
    return this.request('/invoices/my-invoices');
  }

  async getAllInvoices() {
    return this.request('/invoices/all');
  }

  async generateInvoice(invoiceData) {
    return this.request('/invoices/generate', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  }

  // Admin endpoints
  async getAllStudents() {
    return this.request('/admin/students');
  }

  async getStudentDetails(studentID) {
    return this.request(`/admin/students/${studentID}`);
  }
}

export default new ApiService();

