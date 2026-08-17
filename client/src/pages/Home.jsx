const EcgLine = ({ className }) => (
  <svg className={className} viewBox="0 0 500 120" preserveAspectRatio="none">
    <path
      className="ecg-path"
      d="M0,60 L100,60 L120,60 L135,20 L150,100 L165,60 L180,60 L500,60"
    />
  </svg>
);

const FeatureIcon = ({ d }) => (
  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Home = () => {
  return (
    <div>
      <section className="hero">
        <div className="ecg-wrap"><EcgLine /></div>
        <div className="hero-eyebrow">A public blood-donation service</div>
        <h1 className="display-font">
          Blood finds a match faster when the <span>system</span> keeps the pulse.
        </h1>
        <p>
          BloodLink connects donors, hospitals, and blood banks on one platform — real-time
          inventory, verified donor records, and requests that reach the right blood type
          before it's too late.
        </p>
        <div className="hero-actions">
          <a href="/register" className="btn-solid">Become a Donor</a>
          <a href="/about" className="btn-ghost">How It Works</a>
        </div>
      </section>

      <div className="ecg-divider"><EcgLine /></div>

      <section className="section">
        <div className="section-eyebrow">What BloodLink does</div>
        <h2 className="section-title display-font">Every unit of blood, tracked from donation to transfusion.</h2>
        <p className="section-body">
          No spreadsheets, no phone chains. Donors register once, hospitals see live stock
          by blood group, and staff issue units with a status trail from collection to patient.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <FeatureIcon d="M12 21s-8-4.5-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 6.5-8 11-8 11z" />
            <h3>Verified Donors</h3>
            <p>Blood group, eligibility, and donation history kept accurate and up to date.</p>
          </div>
          <div className="feature-card">
            <FeatureIcon d="M3 7h18M3 12h18M3 17h18" />
            <h3>Live Inventory</h3>
            <p>Every blood unit tracked by bag ID, storage location, and expiry — never guesswork.</p>
          </div>
          <div className="feature-card">
            <FeatureIcon d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
            <h3>Emergency Requests</h3>
            <p>Urgent and emergency cases surface first, so critical needs never get buried.</p>
          </div>
          <div className="feature-card">
            <FeatureIcon d="M12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" />
            <h3>Role-Based Access</h3>
            <p>Donors, doctors, and blood bank staff each see exactly what they need — nothing more.</p>
          </div>
        </div>
      </section>

      <div className="ecg-divider"><EcgLine /></div>

      <section className="section">
        <div className="section-eyebrow">The process</div>
        <h2 className="section-title display-font">From registration to transfusion, in four steps.</h2>

        <div className="steps">
          <div className="step-item">
            <div className="step-number">01</div>
            <h3>Register</h3>
            <p>Create an account and add your blood group, eligibility, and contact details.</p>
          </div>
          <div className="step-item">
            <div className="step-number">02</div>
            <h3>Donate</h3>
            <p>Staff record your donation, screen it, and it enters the tracked inventory.</p>
          </div>
          <div className="step-item">
            <div className="step-number">03</div>
            <h3>Match</h3>
            <p>A doctor or hospital raises a request; matching units are located instantly.</p>
          </div>
          <div className="step-item">
            <div className="step-number">04</div>
            <h3>Transfuse</h3>
            <p>The unit is issued, the patient is treated, and the record closes the loop.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;