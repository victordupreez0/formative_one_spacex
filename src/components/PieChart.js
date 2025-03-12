import React from 'react';

const PieChart = () => {
  return (
    <div className="pie-chart">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="#e0e0e0" />
        <path 
          d="M 50 50 L 50 10 A 40 40 0 0 1 86 65 Z" 
          fill="#a0a0a0" 
        />
      </svg>
    </div>
  );
};

export default PieChart;