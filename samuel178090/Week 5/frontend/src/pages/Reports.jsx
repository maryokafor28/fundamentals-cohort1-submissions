import { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { userService } from '../services/userService';
import { authService } from '../services/authService';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    user: '',
    title: '',
    reportType: 'lab',
    testResults: [],
    diagnosis: {
      primary: '',
      secondary: [],
      icd10Code: ''
    },
    prescriptions: [],
    findings: {
      symptoms: [],
      examination: '',
      recommendations: ''
    },
    summary: ''
  });

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const response = await authService.getMe();
      setCurrentUser(response.data.user);
      fetchReports(response.data.user);
      if (response.data.user.role === 'doctor') {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const fetchReports = async (user = currentUser) => {
    try {
      let response;
      if (user?.role === 'admin') {
        response = await reportService.getAll();
      } else {
        response = await reportService.getUserReports();
      }
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reportData = {
        userId: formData.user,
        reportType: formData.reportType,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        endDate: new Date(),
        findings: formData.findings,
        diagnosis: formData.diagnosis,
        prescriptions: formData.prescriptions || [],
        testResults: formData.testResults || []
      };
      console.log('Sending report data:', reportData);
      await reportService.generate(reportData);
      setFormData({
        user: '', title: '', reportType: 'lab', testResults: [], 
        diagnosis: { primary: '', secondary: [], icd10Code: '' },
        prescriptions: [], findings: { symptoms: [], examination: '', recommendations: '' },
        summary: ''
      });
      setShowForm(false);
      fetchReports();
    } catch (error) {
      console.error('Error generating report:', error);
      const errorMessage = error.response?.data?.message || 'Error generating report. Please try again.';
      alert(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await reportService.delete(id);
        fetchReports();
      } catch (error) {
        console.error('Error deleting report:', error);
      }
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#1e40af', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          📊 {currentUser?.role === 'patient' ? 'My Medical Reports' : 'Medical Reports'}
        </h1>
        {currentUser?.role === 'doctor' && (
          <button 
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '12px 24px',
              background: '#0891b2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {showForm ? 'Cancel' : '➕ Generate Report'}
          </button>
        )}
      </div>

      {showForm && currentUser?.role === 'doctor' && (
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>Generate Medical Report</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <select
                value={formData.user}
                onChange={(e) => setFormData({...formData, user: e.target.value})}
                required
                style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px' }}
              >
                <option value="">Select Patient</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>{user.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Report Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px' }}
              />
              <select
                value={formData.reportType}
                onChange={(e) => setFormData({...formData, reportType: e.target.value})}
                style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px' }}
              >
                <option value="lab">🧪 Lab Report</option>
                <option value="radiology">📷 Radiology</option>
                <option value="pathology">🔬 Pathology</option>
                <option value="consultation">👨⚕️ Consultation</option>
                <option value="discharge">🏠 Discharge</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Primary Diagnosis"
                value={formData.diagnosis.primary}
                onChange={(e) => setFormData({
                  ...formData, 
                  diagnosis: {...formData.diagnosis, primary: e.target.value}
                })}
                style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px' }}
              />
              <input
                type="text"
                placeholder="ICD-10 Code"
                value={formData.diagnosis.icd10Code}
                onChange={(e) => setFormData({
                  ...formData, 
                  diagnosis: {...formData.diagnosis, icd10Code: e.target.value}
                })}
                style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px' }}
              />
            </div>

            <textarea
              placeholder="Clinical Findings & Recommendations"
              value={formData.findings.recommendations}
              onChange={(e) => setFormData({
                ...formData, 
                findings: {...formData.findings, recommendations: e.target.value}
              })}
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '2px solid #e2e8f0', 
                borderRadius: '8px',
                minHeight: '100px',
                marginBottom: '1rem'
              }}
            />

            <button 
              type="submit"
              style={{
                padding: '12px 24px',
                background: '#0891b2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Generate Report
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {reports.map(report => (
          <div key={report._id} style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ color: '#1e40af', margin: 0 }}>{report.title}</h3>
                  <span style={{
                    padding: '4px 12px',
                    background: report.reportType === 'lab' ? '#dbeafe' : 
                               report.reportType === 'radiology' ? '#f3e8ff' :
                               report.reportType === 'pathology' ? '#ecfdf5' :
                               report.reportType === 'consultation' ? '#fef3c7' : '#fee2e2',
                    color: report.reportType === 'lab' ? '#1e40af' :
                           report.reportType === 'radiology' ? '#7c3aed' :
                           report.reportType === 'pathology' ? '#059669' :
                           report.reportType === 'consultation' ? '#d97706' : '#dc2626',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {report.reportType?.charAt(0).toUpperCase() + report.reportType?.slice(1)}
                  </span>
                </div>
                <p style={{ color: '#64748b', margin: '0.25rem 0' }}>
                  👤 Patient: {report.user?.name || 'Unknown'}
                  {report.generatedBy && (
                    <span style={{ marginLeft: '1rem' }}>
                      👨⚕️ Dr. {report.generatedBy.name}
                    </span>
                  )}
                </p>
                {report.diagnosis?.primary && (
                  <p style={{ color: '#059669', margin: '0.25rem 0', fontWeight: '600' }}>
                    🩺 Diagnosis: {report.diagnosis.primary}
                    {report.diagnosis.icd10Code && ` (${report.diagnosis.icd10Code})`}
                  </p>
                )}
                {report.findings?.recommendations && (
                  <p style={{ color: '#64748b', fontSize: '14px', marginTop: '0.5rem' }}>
                    📋 {report.findings.recommendations}
                  </p>
                )}
                <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '0.5rem' }}>
                  📅 Generated: {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => window.open(`data:text/html,<h1>${report.title}</h1><p><strong>Patient:</strong> ${report.user?.name}</p><p><strong>Diagnosis:</strong> ${report.diagnosis?.primary}</p><p><strong>Recommendations:</strong> ${report.findings?.recommendations}</p>`, '_blank')}
                  style={{
                    padding: '8px 16px',
                    background: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  📄 View
                </button>
                {currentUser?.role === 'admin' && (
                  <button 
                    onClick={() => handleDelete(report._id)}
                    style={{
                      padding: '8px 16px',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {reports.length === 0 && (
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#64748b', marginBottom: '1rem' }}>No medical reports yet</h3>
          <p style={{ color: '#94a3b8' }}>Generate your first medical report to get started</p>
        </div>
      )}
    </div>
  );
};

export default Reports;