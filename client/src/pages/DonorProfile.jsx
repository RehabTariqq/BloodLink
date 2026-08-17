import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { donorService, donationService } from '../services/dataService';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DonorProfile = () => {
  const { user } = useAuth();
  const [donor, setDonor] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    bloodGroup: 'O+',
    dateOfBirth: '',
    city: '',
    country: 'Pakistan',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    lastDonationDate: ''
  });

  const loadDonor = () => {
    setLoading(true);
    donorService.getAll()
      .then((res) => {
        const mine = res.data.data.find((d) => d.user?._id === user?.id || d.user === user?.id);
        if (mine) {
          setDonor(mine);
          setFormData({
            bloodGroup: mine.bloodGroup,
            dateOfBirth: mine.dateOfBirth ? mine.dateOfBirth.slice(0, 10) : '',
            city: mine.address?.city || '',
            country: mine.address?.country || 'Pakistan',
            emergencyName: mine.emergencyContact?.name || '',
            emergencyPhone: mine.emergencyContact?.phone || '',
            emergencyRelation: mine.emergencyContact?.relation || '',
            lastDonationDate: mine.lastDonationDate ? mine.lastDonationDate.slice(0, 10) : ''
          });
          donationService.getAll({ donor: mine._id })
            .then((hRes) => setHistory(hRes.data.data))
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadDonor(); }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const buildPayload = () => ({
    bloodGroup: formData.bloodGroup,
    dateOfBirth: formData.dateOfBirth,
    address: { city: formData.city, country: formData.country },
    emergencyContact: {
      name: formData.emergencyName,
      phone: formData.emergencyPhone,
      relation: formData.emergencyRelation
    },
    ...(formData.lastDonationDate ? { lastDonationDate: formData.lastDonationDate } : {})
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const res = await donorService.create(buildPayload());
      setDonor(res.data.data);
      setSuccess('Your donor profile has been created.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create donor profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const res = await donorService.update(donor._id, buildPayload());
      setDonor(res.data.data);
      setSuccess('Profile updated.');
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading...</p>;

  if (donor && !editing) {
    return (
      <div>
        <h1 className="page-title">My Donor Profile</h1>
        {success && <div style={{ color: 'var(--green)', marginBottom: '1rem' }}>{success}</div>}
        <div className="panel" style={{ maxWidth: 480 }}>
          <div className="form-field">
            <div className="form-label">Blood Group</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--blue)' }}>{donor.bloodGroup}</div>
          </div>
          <div className="form-field">
            <div className="form-label">Eligibility</div>
            <span className={`status-pill status-${donor.eligibilityStatus === 'eligible' ? 'active' : 'pending'}`}>
              {donor.eligibilityStatus}
            </span>
          </div>
          <div className="form-field">
            <div className="form-label">Last Donation</div>
            <div>{donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : 'Never donated yet'}</div>
          </div>
          <div className="form-field">
            <div className="form-label">City</div>
            <div>{donor.address?.city || '—'}</div>
          </div>
          <button className="btn-small" onClick={() => setEditing(true)}>Edit Profile</button>
        </div>

        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '2rem 0 1rem' }}>Donation History</h2>
        {history.length === 0 ? (
          <div className="empty-state">No donations recorded yet.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Bag ID</th>
                <th>Collection Date</th>
                <th>Screening</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h._id}>
                  <td>{h.bloodBagId}</td>
                  <td>{new Date(h.collectionDate).toLocaleDateString()}</td>
                  <td><span className={`status-pill status-${h.screeningStatus}`}>{h.screeningStatus}</span></td>
                  <td>{h.donationStatus.replace(/_/g, ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">{donor ? 'Edit Donor Profile' : 'Become a Donor'}</h1>
      {!donor && (
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: 500 }}>
          Fill in your details below to register as a blood donor.
        </p>
      )}

      {error && <div className="auth-error" style={{ maxWidth: 480 }}>{error}</div>}

      <form onSubmit={donor ? handleUpdate : handleCreate} className="panel" style={{ maxWidth: 480 }}>
        <div className="form-field">
          <label className="form-label">Blood Group</label>
          <select className="form-select" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
            {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Date of Birth</label>
          <input className="form-input" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label className="form-label">City</label>
          <input className="form-input" name="city" value={formData.city} onChange={handleChange} required placeholder="Lahore" />
        </div>

        {donor && (
          <div className="form-field">
            <label className="form-label">Last Donation Date</label>
            <input
              className="form-input"
              type="date"
              name="lastDonationDate"
              value={formData.lastDonationDate}
              onChange={handleChange}
            />
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Donated somewhere and want it noted here? Set the date manually — your profile stays saved for next time.
            </div>
          </div>
        )}

        <div className="form-field">
          <label className="form-label">Emergency Contact Name</label>
          <input className="form-input" name="emergencyName" value={formData.emergencyName} onChange={handleChange} placeholder="Sara Khan" />
        </div>
        <div className="form-field">
          <label className="form-label">Emergency Contact Phone</label>
          <input className="form-input" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} placeholder="03001234567" />
        </div>
        <div className="form-field">
          <label className="form-label">Relation</label>
          <input className="form-input" name="emergencyRelation" value={formData.emergencyRelation} onChange={handleChange} placeholder="Sister" />
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Saving...' : donor ? 'Save Changes' : 'Create Donor Profile'}
          </button>
          {donor && (
            <button type="button" className="btn-ghost" style={{ padding: '0.7rem 1.2rem' }} onClick={() => setEditing(false)}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default DonorProfile;