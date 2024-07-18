import React, { useState } from "react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      style={{
        width: isCollapsed ? "50px" : "200px",
        transition: "width 0.3s",
      }}
    >
      <button onClick={toggleSidebar}>
        {isCollapsed ? "Expand" : "Collapse"}
      </button>
      <div>
        {isCollapsed ? (
          <span>Menu</span>
        ) : (
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
            <li>Services</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
