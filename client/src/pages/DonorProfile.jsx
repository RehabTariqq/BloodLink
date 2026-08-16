import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { donorService } from '../services/dataService';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DonorProfile = () => {
  const { user } = useAuth();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
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
    emergencyRelation: ''
  });

  useEffect(() => {
    donorService.getAll({ mine: true })
      .then((res) => {
        const mine = res.data.data.find((d) => d.user?._id === user?.id || d.user === user?.id);
        if (mine) setDonor(mine);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const payload = {
        bloodGroup: formData.bloodGroup,
        dateOfBirth: formData.dateOfBirth,
        address: { city: formData.city, country: formData.country },
        emergencyContact: {
          name: formData.emergencyName,
          phone: formData.emergencyPhone,
          relation: formData.emergencyRelation
        }
      };
      const res = await donorService.create(payload);
      setDonor(res.data.data);
      setSuccess('Your donor profile has been created.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create donor profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading...</p>;

  if (donor) {
    return (
      <div>
        <h1 className="page-title">My Donor Profile</h1>
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
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Become a Donor</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: 500 }}>
        Fill in your details below to register as a blood donor. This information helps hospitals
        find a match quickly when someone needs your blood type.
      </p>

      {error && <div className="auth-error" style={{ maxWidth: 480 }}>{error}</div>}
      {success && <div style={{ color: 'var(--green)', marginBottom: '1rem' }}>{success}</div>}

      <form onSubmit={handleSubmit} className="panel" style={{ maxWidth: 480 }}>
        <div className="form-field">
          <label className="form-label">Blood Group</label>
          <select className="form-select" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
            {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
          </select>
        </div>

        <div className="form-field">
          <label className="form-label">Date of Birth</label>
          <input
            className="form-input"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label className="form-label">City</label>
          <input
            className="form-input"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            placeholder="Lahore"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Emergency Contact Name</label>
          <input
            className="form-input"
            name="emergencyName"
            value={formData.emergencyName}
            onChange={handleChange}
            placeholder="Sara Khan"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Emergency Contact Phone</label>
          <input
            className="form-input"
            name="emergencyPhone"
            value={formData.emergencyPhone}
            onChange={handleChange}
            placeholder="03001234567"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Relation</label>
          <input
            className="form-input"
            name="emergencyRelation"
            value={formData.emergencyRelation}
            onChange={handleChange}
            placeholder="Sister"
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary" style={{ marginTop: '0.5rem' }}>
          {submitting ? 'Saving...' : 'Create Donor Profile'}
        </button>
      </form>
    </div>
  );
};

export default DonorProfile;