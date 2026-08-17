import { useEffect, useState } from 'react';
import { notificationService } from '../services/dataService';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    notificationService.getAll()
      .then((res) => setNotifications(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    try {
      await notificationService.markRead(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <div>
      <h1 className="page-title">Notifications</h1>
      {error && <div className="auth-error">{error}</div>}

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      ) : notifications.length === 0 ? (
        <div className="empty-state">No notifications yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map((n) => (
            <div key={n._id} className="panel" style={{ opacity: n.read ? 0.6 : 1, marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{n.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{n.message}</div>
                </div>
                {!n.read && (
                  <button className="btn-small" onClick={() => markRead(n._id)}>Mark Read</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;