import { useEffect, useState } from 'react';
import { donorService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';

const STAFF_ROLES = ['bloodBankStaff', 'hospitalAdmin', 'superAdmin'];
const ELIGIBILITY_OPTIONS = ['eligible', 'not_eligible', 'pending_review'];

const Donors = () => {
  const { user } = useAuth();
  const isStaff = STAFF_ROLES.includes(user?.role);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    donorService.getAll()
      .then((res) => setDonors(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load donors'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id, eligibilityStatus) => {
    try {
      await donorService.update(id, { eligibilityStatus });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete donor profile for ${name}? This cannot be undone.`)) return;
    try {
      await donorService.delete(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete donor');
    }
  };

  return (
    <div>
      <h1 className="page-title">Donors</h1>
      {error && <div className="auth-error">{error}</div>}
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      ) : donors.length === 0 ? (
        <div className="empty-state">No donors found yet.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Blood Group</th>
              <th>Last Donation</th>
              <th>Eligibility</th>
              {isStaff && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {donors.map((d) => (
              <tr key={d._id}>
                <td>{d.user?.name || '—'}</td>
                <td>{d.user?.email || '—'}</td>
                <td>{d.bloodGroup}</td>
                <td>{d.lastDonationDate ? new Date(d.lastDonationDate).toLocaleDateString() : 'Never'}</td>
                <td>
                  {isStaff ? (
                    <select
                      className="status-select"
                      value={d.eligibilityStatus}
                      onChange={(e) => handleStatusChange(d._id, e.target.value)}
                    >
                      {ELIGIBILITY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`status-pill status-${d.eligibilityStatus === 'eligible' ? 'active' : 'pending'}`}>
                      {d.eligibilityStatus}
                    </span>
                  )}
                </td>
                {isStaff && (
                  <td>
                    <button className="btn-danger" onClick={() => handleDelete(d._id, d.user?.name)}>Delete</button>
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

export default Donors;