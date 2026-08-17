import { useEffect, useState } from 'react';
import { appointmentService, donorService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';

const STAFF_ROLES = ['bloodBankStaff', 'hospitalAdmin', 'superAdmin'];

const Appointments = () => {
  const { user } = useAuth();
  const isStaff = STAFF_ROLES.includes(user?.role);
  const [appointments, setAppointments] = useState([]);
  const [myDonorId, setMyDonorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ slotDate: '', slotTime: '', notes: '' });

  const load = () => {
    setLoading(true);
    Promise.all([appointmentService.getAll(), donorService.getAll()])
      .then(([aRes, dRes]) => {
        setAppointments(aRes.data.data);
        const mine = dRes.data.data.find((d) => d.user?._id === user?.id || d.user === user?.id);
        if (mine) setMyDonorId(mine._id);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!myDonorId) {
      setError('Create your donor profile first before booking an appointment.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await appointmentService.create({ ...formData, donor: myDonorId });
      setFormData({ slotDate: '', slotTime: '', notes: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await appointmentService.update(id, { status });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <div>
      <h1 className="page-title">Appointments</h1>
      {error && <div className="auth-error">{error}</div>}

      {!isStaff && (
        <div className="panel" style={{ maxWidth: 480 }}>
          <div className="panel-title">Book a Donation Appointment</div>
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="form-label">Date</label>
              <input className="form-input" type="date" name="slotDate" value={formData.slotDate} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label className="form-label">Time</label>
              <input className="form-input" type="time" name="slotTime" value={formData.slotTime} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label className="form-label">Notes (optional)</label>
              <input className="form-input" name="notes" value={formData.notes} onChange={handleChange} />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      ) : appointments.length === 0 ? (
        <div className="empty-state">No appointments yet.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Donor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              {isStaff && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>{a.donor?.user?.name || '—'}</td>
                <td>{new Date(a.slotDate).toLocaleDateString()}</td>
                <td>{a.slotTime}</td>
                <td><span className={`status-pill status-${a.status === 'approved' || a.status === 'completed' ? 'active' : a.status === 'cancelled' || a.status === 'no_show' ? 'expired' : 'pending'}`}>{a.status.replace('_', ' ')}</span></td>
                {isStaff && (
                  <td style={{ display: 'flex', gap: '0.4rem' }}>
                    {a.status === 'pending' && <button className="btn-small" onClick={() => updateStatus(a._id, 'approved')}>Approve</button>}
                    {a.status === 'approved' && <button className="btn-small" onClick={() => updateStatus(a._id, 'completed')}>Complete</button>}
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

export default Appointments;