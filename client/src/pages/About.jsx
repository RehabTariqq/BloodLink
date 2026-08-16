const About = () => {
  return (
    <section className="section" style={{ paddingTop: '4rem' }}>
      <div className="section-eyebrow">About BloodLink</div>
      <h1 className="section-title display-font">A shared blood-bank ledger, open to anyone.</h1>
      <p className="section-body">
        BloodLink isn't built for one hospital — it's built as a public service that any donor,
        doctor, or blood bank can use. A donor in one city can be found by a hospital in another,
        because the record of who's eligible and what's in stock lives in one place, not in
        separate spreadsheets per hospital.
      </p>

      <div className="feature-grid" style={{ marginTop: '3rem' }}>
        <div className="feature-card">
          <h3>Why it exists</h3>
          <p>
            Blood shortages are rarely about supply — they're about matching the right donor to
            the right request fast enough. BloodLink closes that gap with real-time data instead
            of phone calls.
          </p>
        </div>
        <div className="feature-card">
          <h3>Who it's for</h3>
          <p>
            Donors who want their eligibility and history tracked properly. Doctors and nurses
            who need to raise a request in seconds. Blood bank staff who need to know exactly
            what's in the fridge and when it expires.
          </p>
        </div>
        <div className="feature-card">
          <h3>How data stays safe</h3>
          <p>
            Every account is role-restricted — donors see their own records, staff see inventory
            and requests, and sensitive actions are logged. Passwords are hashed, sessions are
            token-based, and nothing is public that shouldn't be.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;