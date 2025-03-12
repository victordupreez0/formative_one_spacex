import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../Images/Icon_Logo.svg';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <div className="navbar">
      <div className="logo">
        <Link to="/">
        <img src={logo} alt="" width= '60px'/>
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          HOME
        </Link>
        <Link to="/compare" className={location.pathname === '/compare' ? 'active' : ''}>
          COMPARE
        </Link>
        <Link to="/timeline" className={location.pathname === '/timeline' ? 'active' : ''}>
          TIMELINE
        </Link>
      </div>
    </div>
  );
};

export default Navbar;