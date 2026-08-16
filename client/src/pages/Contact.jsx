import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="section" style={{ paddingTop: '4rem' }}>
      <div className="section-eyebrow">Get in touch</div>
      <h1 className="section-title display-font">Questions, partnerships, or a hospital to onboard?</h1>

      <div className="contact-grid">
        <div>
         <div className="contact-info-item">
            <div className="label">Email</div>
            <div className="value">rehabtariqq@gmail.com</div>
        
          </div>
          <div className="contact-info-item">
            <div className="label">For Hospitals</div>
            <div className="value">Register your hospital directly from your dashboard once signed in as a Hospital Admin.</div>
          </div>
          <div className="contact-info-item">
            <div className="label">Response Time</div>
            <div className="value">Usually within 1–2 business days.</div>
          </div>
        </div>

        <form className="contact-form panel" onSubmit={handleSubmit}>
          {sent ? (
            <p style={{ color: 'var(--green)' }}>Thanks — your message has been noted. We'll get back to you soon.</p>
          ) : (
            <>
              <div className="form-field">
                <label className="form-label">Name</label>
                <input className="form-input" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label className="form-label">Message</label>
                <textarea className="form-input" name="message" value={formData.message} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn-small">Send Message</button>
            </>
          )}
        </form>
      </div>
    </section>
  );
};

export default Contact;