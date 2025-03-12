import React from 'react';

const PentagonChart = () => {
  return (
    <div className="pentagon-chart">
      <svg viewBox="0 0 100 100">
        <polygon 
          points="50,10 90,40 80,90 20,90 10,40" 
          fill="#e0e0e0" 
          stroke="#a0a0a0" 
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};

export default PentagonChart;