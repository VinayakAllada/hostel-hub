// ES6 Class for processing chart data
class ChartDataProcessor {
  constructor() {
    this.data = [];
  }

  setData(data) {
    this.data = data;
    return this;
  }

  // Process attendance data for charts
  processAttendanceData(attendanceData) {
    if (!Array.isArray(attendanceData)) return { labels: [], present: [], absent: [] };

    const last30Days = this.getLast30Days();
    const dataMap = {};

    attendanceData.forEach(record => {
      const date = new Date(record.date).toISOString().split('T')[0];
      if (!dataMap[date]) {
        dataMap[date] = { present: 0, absent: 0 };
      }
      if (record.status === 'present') {
        dataMap[date].present++;
      } else {
        dataMap[date].absent++;
      }
    });

    const labels = [];
    const present = [];
    const absent = [];

    last30Days.forEach(date => {
      const dateStr = date.toISOString().split('T')[0];
      labels.push(dateStr);
      present.push(dataMap[dateStr]?.present || 0);
      absent.push(dataMap[dateStr]?.absent || 0);
    });

    return { labels, present, absent };
  }

  // Process statistics for pie chart
  processStatsForPie(stats) {
    if (!Array.isArray(stats)) return [];

    const totalPresent = stats.reduce((sum, stat) => sum + (stat.present || 0), 0);
    const totalAbsent = stats.reduce((sum, stat) => sum + (stat.absent || 0), 0);

    return [
      { name: 'Present', value: totalPresent },
      { name: 'Absent', value: totalAbsent }
    ];
  }

  // Get last 30 days
  getLast30Days() {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  }

  // Process complaints by category
  processComplaintsByCategory(complaints) {
    if (!Array.isArray(complaints)) return [];

    const categoryMap = {};
    complaints.forEach(complaint => {
      const category = complaint.category || 'other';
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  }

  // Process monthly data
  processMonthlyData(data, dateField = 'date') {
    if (!Array.isArray(data)) return [];

    const monthlyMap = {};
    data.forEach(item => {
      const date = new Date(item[dateField]);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + 1;
    });

    return Object.entries(monthlyMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}

export default ChartDataProcessor;

