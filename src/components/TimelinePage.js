import React from 'react';
import '../comp_styles/TimelinePage.css';

const TimelinePage = () => {
  return (
    <div className="timeline-page">
      <h1 className="page-title">TIMELINE</h1>
      
      <div className="timeline-filters">
        <button className="filter-button">BUTTON</button>
        <button className="filter-button">BUTTON</button>
        <button className="filter-button">BUTTON</button>
        <button className="filter-button">BUTTON</button>
        <button className="filter-button">BUTTON</button>
      </div>
      
      <div className="timeline-chart">
        <div className="chart-container">
          <div className="y-axis-label">
            <h2 className="vertical-text">HEADER</h2>
          </div>
          <div className="x-axis-label">
            <h2>HEADER</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;