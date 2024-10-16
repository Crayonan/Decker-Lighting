import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 right-0 z-10 flex flex-col items-end p-4 pb-20 space-y-2 bg-transparent text-dark-text-secondary md:pb-4">
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
  );
};

export default Footer;