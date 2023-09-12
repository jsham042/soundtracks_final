import React from "react";

const LogoutButton = ({ onLogout }) => {
  return (
    <button className="Logout-button" onClick={onLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
