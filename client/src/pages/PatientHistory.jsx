import { useEffect, useState } from 'react';
import { requestService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';

const STAFF_ROLES = ['bloodBankStaff', 'hospitalAdmin', 'superAdmin'];
const STATUS_OPTIONS = [
  'pending',
  'under_review',
  'approved',
  'partially_fulfilled',
  'ready',
  'fulfilled',
  'rejected',
  'cancelled'
];

const PatientHistory = () => {
  const { user } = useAuth();
  const isStaff = STAFF_ROLES.includes(user?.role);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    requestService.getAll()
      .then((res) => setRequests(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await requestService.updateStatus(id, { status });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete patient record for ${name}? This cannot be undone.`)) return;
    try {
      await requestService.delete(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
    }
  };

  const filtered = requests.filter((r) =>
    r.patientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="page-title">Patient History</h1>
      {error && <div className="auth-error">{error}</div>}

      <input
        className="form-input"
        placeholder="Search by patient name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 320, marginBottom: '1.5rem' }}
      />

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="empty-state">No matching patient records.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Blood Group</th>
              <th>Department</th>
              <th>Required Date</th>
              <th>Status</th>
              {isStaff && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r._id}>
                <td>{r.patientName}</td>
                <td>{r.bloodGroup}</td>
                <td>{r.department || '—'}</td>
                <td>{new Date(r.requiredDate).toLocaleDateString()}</td>
                <td>
                  {isStaff ? (
                    <select
                      className="status-select"
                      value={r.status}
                      onChange={(e) => handleStatusChange(r._id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`status-pill status-${r.status}`}>{r.status.replace(/_/g, ' ')}</span>
                  )}
                </td>
                {isStaff && (
                  <td>
                    <button className="btn-danger" onClick={() => handleDelete(r._id, r.patientName)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientHistory;