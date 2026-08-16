import { useEffect, useState } from 'react';
import { requestService } from '../services/dataService';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    patientName: '', bloodGroup: 'O+', unitsRequired: 1, urgency: 'routine', department: '', requiredDate: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    requestService.getAll()
      .then((res) => setRequests(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load requests'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await requestService.create(formData);
      setFormData({ patientName: '', bloodGroup: 'O+', unitsRequired: 1, urgency: 'routine', department: '', requiredDate: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Blood Requests</h1>
      {error && <div className="auth-error">{error}</div>}

      <div className="panel">
        <div className="panel-title">New Request</div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input className="form-input" name="patientName" placeholder="Patient name" value={formData.patientName} onChange={handleChange} required />
            <select className="form-select" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => <option key={bg} value={bg}>{bg}</option>)}
            </select>
            <input className="form-input" type="number" min="1" name="unitsRequired" value={formData.unitsRequired} onChange={handleChange} required />
            <select className="form-select" name="urgency" value={formData.urgency} onChange={handleChange}>
              <option value="routine">Routine</option>
              <option value="urgent">Urgent</option>
              <option value="emergency">Emergency</option>
            </select>
            <input className="form-input" name="department" placeholder="Department" value={formData.department} onChange={handleChange} />
            <input className="form-input" type="date" name="requiredDate" value={formData.requiredDate} onChange={handleChange} required />
          </div>
          <button type="submit" disabled={submitting} className="btn-small" style={{ marginTop: '0.9rem' }}>
            {submitting ? 'Submitting...' : 'Create Request'}
          </button>
        </form>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      ) : requests.length === 0 ? (
        <div className="empty-state">No requests yet.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Blood Group</th>
              <th>Units</th>
              <th>Urgency</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r._id}>
                <td>{r.patientName}</td>
                <td>{r.bloodGroup}</td>
                <td>{r.unitsFulfilled}/{r.unitsRequired}</td>
                <td><span className={`status-pill status-${r.urgency === 'emergency' ? 'expired' : r.urgency === 'urgent' ? 'pending' : 'active'}`}>{r.urgency}</span></td>
                <td><span className={`status-pill status-${r.status}`}>{r.status.replace('_', ' ')}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Requests;