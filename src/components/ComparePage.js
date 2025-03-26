import React, { useState, useEffect } from 'react';
import '../comp_styles/ComparePage.css';

const ComparePage = () => {
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [launch1, setLaunch1] = useState(null);
  const [launch2, setLaunch2] = useState(null);
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [error1, setError1] = useState(null);
  const [error2, setError2] = useState(null);
  const [suggestions1, setSuggestions1] = useState([]);
  const [suggestions2, setSuggestions2] = useState([]);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);

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

  // Function to fetch launch details
  const fetchLaunch = async (query, setLaunch, setIsLoading, setError) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.spacexdata.com/v5/launches/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: { name: { $regex: query, $options: 'i' } },
          options: { limit: 1 },
        }),
      });

      const data = await response.json();
      if (data.docs.length > 0) {
        setLaunch(data.docs[0]);
      } else {
        setError('No launch found.');
      }
    } catch (error) {
      setError('Error fetching launch details.');
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="compare-page">
      <h1 className="page-title">COMPARE</h1>
      <div className="comparison-container">
        
        {/* Left Side */}
        <div className="comparison-side">
          <h2>Launch 1 Lookup</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search Launch 1..."
              className="search-input"
              value={searchQuery1}
              onChange={(e) => {
                setSearchQuery1(e.target.value);
                fetchSuggestions(e.target.value, setSuggestions1);
                setShowDropdown1(true);
              }}
              onFocus={() => setShowDropdown1(true)}
              onBlur={() => setTimeout(() => setShowDropdown1(false), 200)}
            />
            <button className="search-button" onClick={() => fetchLaunch(searchQuery1, setLaunch1, setIsLoading1, setError1)}>SEARCH</button>
          </div>
          {showDropdown1 && suggestions1.length > 0 && (
            <div className="dropdown">
              {suggestions1.map((launch) => (
                <div key={launch.id} className="dropdown-item" onMouseDown={() => {
                  setSearchQuery1(launch.name);
                  fetchLaunch(launch.name, setLaunch1, setIsLoading1, setError1);
                  setShowDropdown1(false);
                }}>
                  {launch.name}
                </div>
              ))}
            </div>
          )}
          {isLoading1 && <p>Loading...</p>}
          {error1 && <p className="error-message">{error1}</p>}
          {launch1 && (
            <div className="launch-details">
              <h2>{launch1.name}</h2>
              <p><strong>Flight Number:</strong> {launch1.flight_number}</p>
              <p><strong>Date:</strong> {new Date(launch1.date_utc).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        {/* Middle Section */}
        <div className="comparison-middle">
          <h1 className="vs-text">VS</h1>
        </div>

        {/* Right Side */}
        <div className="comparison-side">
          <h2>Launch 2 Lookup</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search Launch 2..."
              className="search-input"
              value={searchQuery2}
              onChange={(e) => {
                setSearchQuery2(e.target.value);
                fetchSuggestions(e.target.value, setSuggestions2);
                setShowDropdown2(true);
              }}
              onFocus={() => setShowDropdown2(true)}
              onBlur={() => setTimeout(() => setShowDropdown2(false), 200)}
            />
            <button className="search-button" onClick={() => fetchLaunch(searchQuery2, setLaunch2, setIsLoading2, setError2)}>SEARCH</button>
          </div>
          {showDropdown2 && suggestions2.length > 0 && (
            <div className="dropdown">
              {suggestions2.map((launch) => (
                <div key={launch.id} className="dropdown-item" onMouseDown={() => {
                  setSearchQuery2(launch.name);
                  fetchLaunch(launch.name, setLaunch2, setIsLoading2, setError2);
                  setShowDropdown2(false);
                }}>
                  {launch.name}
                </div>
              ))}
            </div>
          )}
          {isLoading2 && <p>Loading...</p>}
          {error2 && <p className="error-message">{error2}</p>}
          {launch2 && (
            <div className="launch-details">
              <h2>{launch2.name}</h2>
              <p><strong>Flight Number:</strong> {launch2.flight_number}</p>
              <p><strong>Date:</strong> {new Date(launch2.date_utc).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparePage;