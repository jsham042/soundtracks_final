import React, { useState, useEffect } from 'react';
import './ResizableDivider.css';

const ResizableDivider = ({ onResize }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      // Calculate percentage based on mouse position
      const containerWidth = document.querySelector('.SearchAndPlaylist').offsetWidth;
      const mouseX = e.clientX;
      const containerLeft = document.querySelector('.SearchAndPlaylist').getBoundingClientRect().left;
      const percentage = ((mouseX - containerLeft) / containerWidth) * 100;

      // Limit the resize range between 30% and 70%
      const limitedPercentage = Math.min(Math.max(percentage, 30), 70);

      // Call the parent callback with the new widths
      onResize({
        searchWidth: `${limitedPercentage}%`,
        playlistWidth: `${100 - limitedPercentage}%`
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onResize]);

  return (
    <div 
      className="ResizableDivider"
      onMouseDown={handleMouseDown}
      style={{ cursor: isDragging ? 'col-resize' : 'ew-resize' }}
    >
      <div className="divider-line" />
    </div>
  );
};

export default ResizableDivider;