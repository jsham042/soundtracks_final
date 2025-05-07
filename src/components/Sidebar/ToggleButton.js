import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ToggleButton = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    onToggle(!isCollapsed);
  };

  return (
    <button
      onClick={handleToggle}
      style={{ border: "none", background: "transparent", cursor: "pointer" }}
    >
      {isCollapsed ? <FaArrowRight size={20} /> : <FaArrowLeft size={20} />}
    </button>
  );
};

export default ToggleButton;
