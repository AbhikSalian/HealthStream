// LogoutButton.js
import React from 'react';

const LogoutButton = ({ onLogout }) => {
  return (
    <button
      className="btn btn-secondary btn-sm mx-1" // Added 'btn-sm' for smaller size
      onClick={onLogout}
    >
      Logout
    </button>
  );
};

export default LogoutButton;