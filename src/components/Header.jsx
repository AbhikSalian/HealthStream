// Header.js
import React from 'react';
import Logout from './Logout'; // Adjust the path according to your folder structure
import './Header.css'; // Create a CSS file for styling

const Header = () => {
  return (
    <header className="header">
      <h1>HealthStream</h1>
      <Logout />
    </header>
  );
};

export default Header;
