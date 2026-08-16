import { useEffect, useState } from 'react';
import { inventoryService } from '../services/dataService';

const Inventory = () => {
  const [units, setUnits] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([inventoryService.getAll(), inventoryService.getSummary()])
      .then(([unitsRes, summaryRes]) => {
        setUnits(unitsRes.data.data);
        setSummary(summaryRes.data.data);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load inventory'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1 className="page-title">Blood Inventory</h1>
      {error && <div className="auth-error">{error}</div>}

      <div className="stat-grid">
        {summary.length === 0 && !loading && (
          <div className="stat-card"><div className="stat-value">0</div><div className="stat-label">No stock available</div></div>
        )}
        {summary.map((s) => (
          <div className="stat-card" key={s._id}>
            <div className="stat-value">{s.count}</div>
            <div className="stat-label">{s._id} Units</div>
          </div>
        ))}
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      ) : units.length === 0 ? (
        <div className="empty-state">No blood units recorded yet.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Bag ID</th>
              <th>Blood Group</th>
              <th>Storage</th>
              <th>Expiry</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u._id}>
                <td>{u.bloodBagId}</td>
                <td>{u.bloodGroup}</td>
                <td>{u.storageLocation}</td>
                <td>{new Date(u.expiryDate).toLocaleDateString()}</td>
                <td><span className={`status-pill status-${u.status}`}>{u.status.replace('_', ' ')}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Inventory;