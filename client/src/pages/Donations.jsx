import { useEffect, useState } from 'react';
import { donationService, donorService, inventoryService } from '../services/dataService';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    donor: '', bloodGroup: 'O+', bloodBagId: '', collectionDate: '', expiryDate: '', storageLocation: ''
  });

  const load = () => {
    setLoading(true);
    Promise.all([donationService.getAll(), donorService.getAll()])
      .then(([dRes, donorRes]) => {
        setDonations(dRes.data.data);
        setDonors(donorRes.data.data);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await donationService.create(formData);
      setFormData({ donor: '', bloodGroup: 'O+', bloodBagId: '', collectionDate: '', expiryDate: '', storageLocation: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record donation');
    } finally {
      setSubmitting(false);
    }
  };

  const markPassed = async (id) => {
    try {
      await donationService.update(id, { screeningStatus: 'passed' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    }
  };

  const convertToUnit = async (donationId) => {
    try {
      await inventoryService.create({ donation: donationId });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to convert to inventory unit');
    }
  };

  return (
    <div>
      <h1 className="page-title">Blood Donations</h1>
      {error && <div className="auth-error">{error}</div>}

      <div className="panel">
        <div className="panel-title">Record a Donation</div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <select className="form-select" name="donor" value={formData.donor} onChange={handleChange} required>
              <option value="">Select donor</option>
              {donors.map((d) => (
                <option key={d._id} value={d._id}>{d.user?.name || 'Unknown'} — {d.bloodGroup}</option>
              ))}
            </select>
            <select className="form-select" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
              {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
            </select>
            <input className="form-input" name="bloodBagId" placeholder="Bag ID (e.g. BAG-002)" value={formData.bloodBagId} onChange={handleChange} required />
            <input className="form-input" type="date" name="collectionDate" value={formData.collectionDate} onChange={handleChange} required />
            <input className="form-input" type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required />
            <input className="form-input" name="storageLocation" placeholder="Storage location" value={formData.storageLocation} onChange={handleChange} />
          </div>
          <button type="submit" disabled={submitting} className="btn-small" style={{ marginTop: '0.9rem' }}>
            {submitting ? 'Saving...' : 'Record Donation'}
          </button>
        </form>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      ) : donations.length === 0 ? (
        <div className="empty-state">No donations recorded yet.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Bag ID</th>
              <th>Blood Group</th>
              <th>Screening</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d) => (
              <tr key={d._id}>
                <td>{d.bloodBagId}</td>
                <td>{d.bloodGroup}</td>
                <td><span className={`status-pill status-${d.screeningStatus}`}>{d.screeningStatus}</span></td>
                <td><span className={`status-pill status-${d.donationStatus === 'converted_to_unit' ? 'active' : 'pending'}`}>{d.donationStatus.replace(/_/g, ' ')}</span></td>
                <td>
                  {d.screeningStatus === 'pending' && (
                    <button className="btn-small" onClick={() => markPassed(d._id)}>Mark Passed</button>
                  )}
                  {d.screeningStatus === 'passed' && d.donationStatus !== 'converted_to_unit' && (
                    <button className="btn-small" onClick={() => convertToUnit(d._id)}>Add to Inventory</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Donations;