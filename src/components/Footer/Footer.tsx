import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      {/* Mobile footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-center p-4 space-x-4 bg-dark-bg text-dark-text-secondary md:hidden">
        <Link to="/impressum" className="text-sm transition-colors hover:text-dark-text">
          Impressum
        </Link>
        <Link to="/cookies" className="text-sm transition-colors hover:text-dark-text">
          Cookies
        </Link>
        <Link to="/privacy" className="text-sm transition-colors hover:text-dark-text">
          Privacy
        </Link>
      </footer>

      {/* Desktop footer */}
      <footer className="fixed z-10 flex-col items-end hidden p-4 space-y-2 bottom-4 right-4 bg-dark-bg text-dark-text-secondary md:flex">
        <Link to="/impressum" className="text-sm transition-colors hover:text-dark-text">
          Impressum
        </Link>
        <Link to="/cookies" className="text-sm transition-colors hover:text-dark-text">
          Cookies
        </Link>
        <Link to="/privacy" className="text-sm transition-colors hover:text-dark-text">
          Privacy
        </Link>
      </footer>
    </>
  );
};

export default Footer;