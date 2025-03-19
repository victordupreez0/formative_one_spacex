import React, { useState } from 'react';
import SLogo from '../Images/SpaceX_Logo1.svg';
import LaunchList from './LaunchList';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredLaunch, setFeaturedLaunch] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    fetchSuggestions(event.target.value, setSuggestions);
    setShowDropdown(true);
  };

  const searchLaunch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First try to search by name
      const response = await fetch(`https://api.spacexdata.com/v5/launches/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            $or: [
              { name: { $regex: searchQuery, $options: 'i' } },
              { flight_number: parseInt(searchQuery) || 0 }
            ]
          },
          options: {
            limit: 1
          }
        })
      });
      
      const data = await response.json();
      
      if (data.docs && data.docs.length > 0) {
        setFeaturedLaunch(data.docs[0]);
      } else {
        setError('No launch found matching your search');
      }
    } catch (err) {
      setError('Error searching for launch. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      searchLaunch();
    }
  };

  // Function to fetch suggestions
  const fetchSuggestions = async (query, setSuggestions) => {
    if (!query.trim()) return;

    try {
      const response = await fetch(`https://api.spacexdata.com/v5/launches/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: { name: { $regex: query, $options: 'i' } },
          options: { limit: 5 },
        }),
      });

      const data = await response.json();
      if (data.docs) {
        setSuggestions(data.docs);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  // Get the background image URL from the featured launch
  const backgroundImageUrl = featuredLaunch?.links?.flickr?.original?.[0] || '';

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <img src={SLogo} alt=''></img>
          <h1 className="big-header">
            LAUNCH ASSISTANT
          </h1>

          <p className="hero-text">
            Meet the unofficial SpaceX launch info tool. This tool is not very effective, because of the API only recording <br></br>
            launches up to 2022. But still, it shows off that React do code
          </p>
          <div className="button-group">
            <button className="action-button">API Docs</button>
            <button className="action-button">SpaceX Official</button>
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
      <LaunchList/>
      <div className="launch-lookup">
        <h2>LAUNCH LOOKUP</h2>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="SEARCH..." 
            className="search-input" 
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
          <button className="search-button" onClick={searchLaunch}>SEARCH</button>
          {showDropdown && suggestions.length > 0 && (
            <div className="dropdown">
              {suggestions.map((launch) => (
                <div key={launch.id} className="dropdown-item" onMouseDown={() => {
                  setSearchQuery(launch.name);
                  searchLaunch();
                  setShowDropdown(false);
                }}>
                  {launch.name}
                </div>
              ))}
            </div>
          )}
        </div>
        {isLoading && <p>Searching for launch...</p>}
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="featured-launch" style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="featured-content">
          <div className="featured-text">
            <h3>FEATURED LAUNCH</h3>
            <h2>{featuredLaunch ? featuredLaunch.name : 'LAUNCH NAME'}</h2>
            <p>
              {featuredLaunch ? featuredLaunch.details || 'No details available for this launch.' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'}
            </p>
            <div className="button-group">
              {featuredLaunch && featuredLaunch.links.webcast && (
                <a href={featuredLaunch.links.webcast} target="_blank" rel="noopener noreferrer" className="action-button">WATCH</a>
              )}
              {featuredLaunch && featuredLaunch.links.article && (
                <a href={featuredLaunch.links.article} target="_blank" rel="noopener noreferrer" className="action-button">ARTICLE</a>
              )}
              {!featuredLaunch && (
                <>
                  <button className="action-button">BUTTON</button>
                  <button className="action-button">BUTTON</button>
                </>
              )}
            </div>
          </div>
          <div className="featured-headers">
            <h3>HEADER:</h3>
            {featuredLaunch && (
              <div className="rocket-info">
                <p><strong>Rocket:</strong> {featuredLaunch.rocket}</p>
                <p><strong>Flight Number:</strong> {featuredLaunch.flight_number}</p>
                <p><strong>Date:</strong> {new Date(featuredLaunch.date_utc).toLocaleDateString()}</p>
                {featuredLaunch.success !== undefined && (
                  <p><strong>Success:</strong> {featuredLaunch.success ? 'Yes' : 'No'}</p>
                )}
              </div>
            )}
            <h3>HEADER:</h3>
            {featuredLaunch && (
              <div className="launch-technical-info">
                <p><strong>Core Reused:</strong> {featuredLaunch.cores && featuredLaunch.cores[0]?.reused ? 'Yes' : 'No'}</p>
                <p><strong>Landing Attempt:</strong> {featuredLaunch.cores && featuredLaunch.cores[0]?.landing_attempt ? 'Yes' : 'No'}</p>
                <p><strong>Landing Success:</strong> {featuredLaunch.cores && featuredLaunch.cores[0]?.landing_success ? 'Yes' : 'No'}</p>
                <p><strong>Launchpad:</strong> {featuredLaunch.launchpad}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;