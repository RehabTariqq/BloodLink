import { useState } from 'react';
import { hospitalService } from '../services/dataService';

const RegisterHospital = () => {
  const [formData, setFormData] = useState({
    name: '', registrationNumber: '', email: '', phone: '', city: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await hospitalService.create({
        name: formData.name,
        registrationNumber: formData.registrationNumber,
        email: formData.email,
        phone: formData.phone,
        address: { city: formData.city }
      });
      setSuccess('Hospital registered. It will appear as pending until approved.');
      setFormData({ name: '', registrationNumber: '', email: '', phone: '', city: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register hospital');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Register a Hospital</h1>
      {error && <div className="auth-error" style={{ maxWidth: 480 }}>{error}</div>}
      {success && <div style={{ color: 'var(--green)', marginBottom: '1rem' }}>{success}</div>}

      <form onSubmit={handleSubmit} className="panel" style={{ maxWidth: 480 }}>
        <div className="form-field">
          <label className="form-label">Hospital Name</label>
          <input className="form-input" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label className="form-label">Registration Number</label>
          <input className="form-input" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label className="form-label">Phone</label>
          <input className="form-input" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label className="form-label">City</label>
          <input className="form-input" name="city" value={formData.city} onChange={handleChange} required />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Registering...' : 'Register Hospital'}
        </button>
      </form>
    </div>
  );
};

export default RegisterHospital;