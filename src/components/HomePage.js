import React from 'react';
import LaunchCard from './LaunchCard';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="big-header">BIG HEADER</h1>
          <p className="hero-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
            occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
          <div className="button-group">
            <button className="action-button">BUTTON</button>
            <button className="action-button">BUTTON</button>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <h3>API DATA</h3>
          <h2 className="stat-value">1,2345</h2>
        </div>
        <div className="stat-card">
          <h3>API DATA</h3>
          <h2 className="stat-value">1,2345</h2>
        </div>
        <div className="stat-card">
          <h3>API DATA</h3>
          <h2 className="stat-value">1,2345</h2>
        </div>
      </div>

      <div className="recent-launches">
        <div className="launch-grid">
          <LaunchCard />
          <LaunchCard />
          <LaunchCard />
          <LaunchCard />
          <LaunchCard />
        </div>
      </div>

      <div className="launch-lookup">
        <h2>LAUNCH LOOKUP</h2>
        <div className="search-container">
          <input type="text" placeholder="SEARCH..." className="search-input" />
        </div>
      </div>

      <div className="featured-launch">
        <div className="featured-content">
          <div className="featured-text">
            <h3>FEATURED LAUNCH</h3>
            <h2>LAUNCH NAME</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
              voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <div className="button-group">
              <button className="action-button">BUTTON</button>
              <button className="action-button">BUTTON</button>
            </div>
          </div>
          <div className="featured-headers">
            <h3>HEADER:</h3>
            <h3>HEADER:</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
