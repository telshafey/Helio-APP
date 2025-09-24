import React from 'react';
import { Link } from 'react-router-dom';

const LOGO_URL = 'https://i.ibb.co/7v49zC6/helio-logo.png';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <Link to="/" className={`block ${className}`}>
      <img src={LOGO_URL} alt="Helio App Logo" className="h-full w-auto" />
    </Link>
  );
};

export default Logo;