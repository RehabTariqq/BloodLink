import { useEffect, useState } from 'react';
import api from '../services/api';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/audit-logs')
      .then((res) => setLogs(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load audit logs'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="page-title">Audit Logs</h1>
      {error && <div className="auth-error">{error}</div>}

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      ) : logs.length === 0 ? (
        <div className="empty-state">No audit log entries yet.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Target</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l._id}>
                <td>{l.user?.name || '—'}</td>
                <td>{l.action}</td>
                <td>{l.targetType || '—'}</td>
                <td>{new Date(l.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AuditLogs;