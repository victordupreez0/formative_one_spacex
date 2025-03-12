import React from 'react';

const LineChart = () => {
  return (
    <div className="line-chart">
      <svg viewBox="0 0 400 200">
        <path 
          d="M 0 200 Q 100 180, 200 100 T 400 0" 
          fill="none" 
          stroke="white" 
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default LineChart;