import { useEffect, useState } from 'react';
import { donorService } from '../services/dataService';

const Donors = () => {
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
            </tr>
          </thead>
          <tbody>
            {donors.map((d) => (
              <tr key={d._id}>
                <td>{d.user?.name || '—'}</td>
                <td>{d.user?.email || '—'}</td>
                <td>{d.bloodGroup}</td>
                <td>{d.lastDonationDate ? new Date(d.lastDonationDate).toLocaleDateString() : 'Never'}</td>
                <td><span className={`status-pill status-${d.eligibilityStatus === 'eligible' ? 'active' : 'pending'}`}>{d.eligibilityStatus}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Donors;