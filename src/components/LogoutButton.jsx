import React from 'react';

const LogoutButton = ({ onLogout }) => {
  return (
    <button
      className="btn btn-warning mx-2"
      onClick={onLogout}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
