import React, { useState } from 'react';

const ComparePage = () => {
  const [launch1, setLaunch1] = useState(null);
  const [launch2, setLaunch2] = useState(null);

  return (
    <div className="compare-page">
      <h1 className="page-title">COMAPARE</h1>
      
      <div className="comparison-container">
        <div className="comparison-side">
          <div className="dropdown-container">
            <button className="dropdown-button">
              SELECT LAUNCH 1 <span>▼</span>
            </button>
          </div>
          
          <div className="launch-placeholder">
            <h2>LAUNCH NAME</h2>
          </div>
          
          <div className="data-card">
            <h3>HEADER</h3>
          </div>
          
          <div className="data-card">
            <h3>HEADER</h3>
          </div>
        </div>

        <div className="comparison-middle">
          <h1 className="vs-text">VS</h1>
          <div className="comparison-data">
            <div className="bar-graph">
              {/* Bar graph goes here */}
              <div className="bar" style={{ width: '80%' }}></div>
              <div className="bar" style={{ width: '60%' }}></div>
              <div className="bar" style={{ width: '90%' }}></div>
              <div className="bar" style={{ width: '40%' }}></div>
              <div className="bar" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>

        <div className="comparison-side">
          <div className="dropdown-container">
            <button className="dropdown-button">
              SELECT LAUNCH 2 <span>▼</span>
            </button>
          </div>
          
          <div className="launch-placeholder">
            <h2>LAUNCH NAME</h2>
          </div>
          
          <div className="data-card">
            <h3>HEADER</h3>
          </div>
          
          <div className="data-card">
            <h3>HEADER</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;