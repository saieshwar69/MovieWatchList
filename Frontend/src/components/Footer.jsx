const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} CineStack. All rights reserved.</p>

        <div className="tmdb-badge">
          
          <span>Powered by TMDB</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
