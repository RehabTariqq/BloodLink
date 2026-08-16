const Footer = () => {
  return (
    <footer className="public-footer">
      <span>© {new Date().getFullYear()} BloodLink. A public blood-donation service.</span>
      <span>Built for donors, hospitals, and blood banks.</span>
    </footer>
  );
};

export default Footer;