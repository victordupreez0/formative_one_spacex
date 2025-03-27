import React, { useState, useEffect } from 'react';
import SLogo from '../Images/SpaceX_Logo1.svg';
import LaunchList from './LaunchList';
import Button from './Button';
import '../comp_styles/HomePage.css';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredLaunch, setFeaturedLaunch] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [totalLaunches, setTotalLaunches] = useState(0);
  const [successfulLaunches, setSuccessfulLaunches] = useState(0);
  const [totalRockets, setTotalRockets] = useState(0);
  const [rocketInfo, setRocketInfo] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total number of launches
        const launchesResponse = await fetch('https://api.spacexdata.com/v4/launches');
        const launchesData = await launchesResponse.json();
        setTotalLaunches(launchesData.length);
        setSuccessfulLaunches(launchesData.filter(launch => launch.success).length);

        // Fetch total number of rockets
        const rocketsResponse = await fetch('https://api.spacexdata.com/v4/rockets');
        const rocketsData = await rocketsResponse.json();
        setTotalRockets(rocketsData.length);

        // Set a random launch as the featured launch with an image
        let randomLaunch;
        do {
          randomLaunch = launchesData[Math.floor(Math.random() * launchesData.length)];
        } while (!randomLaunch.links.flickr.original.length);
        setFeaturedLaunch(randomLaunch);

        // Fetch rocket info for the featured launch
        if (randomLaunch) {
          const rocketResponse = await fetch(`https://api.spacexdata.com/v4/rockets/${randomLaunch.rocket}`);
          const rocketData = await rocketResponse.json();
          setRocketInfo(rocketData);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

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
      const response = await fetch('https://api.spacexdata.com/v4/launches/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            name: { $regex: searchQuery, $options: 'i' },
          },
          options: {
            limit: 1,
          },
        }),
      });

      const data = await response.json();

      if (data.docs.length > 0) {
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
      const response = await fetch('https://api.spacexdata.com/v4/launches/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            name: { $regex: query, $options: 'i' },
          },
          options: {
            limit: 100,
          },
        }),
      });

      const data = await response.json();
      setSuggestions(data.docs);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const fetchRandomLaunch = async () => {
    try {
      const response = await fetch('https://api.spacexdata.com/v4/launches');
      const launchesData = await response.json();

      let randomLaunch;
      do {
        randomLaunch = launchesData[Math.floor(Math.random() * launchesData.length)];
      } while (!randomLaunch.links.flickr.original.length);

      setFeaturedLaunch(randomLaunch);

      // Fetch rocket info for the random launch
      if (randomLaunch) {
        const rocketResponse = await fetch(`https://api.spacexdata.com/v4/rockets/${randomLaunch.rocket}`);
        const rocketData = await rocketResponse.json();
        setRocketInfo(rocketData);
      }
    } catch (error) {
      console.error('Error fetching random launch:', error);
    }
  };

  // Get the background image URL from the featured launch
  const backgroundImageUrl = featuredLaunch?.links?.flickr?.original?.[0] || '';

  // Extract YouTube video ID from the webcast link
  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:https?:)?(?:www\.)?(?:youtube\.com(?:[^\n\s]+\S+|(?:v|e(?:mbed)?)|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const youtubeVideoId = featuredLaunch?.links?.webcast ? getYouTubeVideoId(featuredLaunch.links.webcast) : null;

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <img src={SLogo} alt=''></img>
          <h1 className="big-header">
            Launch Assistant
          </h1>

          <p className="hero-text">
            Meet the unofficial SpaceX launch info tool. This tool is not very effective, because of the API only recording <br></br>
            launches up to 2022. But still, it shows off that React do code
          </p>
          <div className="button-group">
            <Button href={'https://github.com/r-spacex/SpaceX-API/tree/master/docs'}>API Docs</Button>
            <Button href={'https://www.spacex.com/'}>SpaceX Official</Button>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <h3>Total Launches</h3>
          <h2 className="stat-value">{totalLaunches}</h2>
        </div>
        <div className="stat-card">
          <h3>Successful Launches</h3>
          <h2 className="stat-value">{successfulLaunches}</h2>
        </div>
        <div className="stat-card">
          <h3>Total Rockets</h3>
          <h2 className="stat-value">{totalRockets}</h2>
        </div>
      </div>
      <LaunchList/>
      <div className="launch-lookup">
        <h2>Launch Lookup</h2>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search..." 
            className="search-input" 
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Delay to allow click on dropdown items
          />
          <button className="search-button" onClick={searchLaunch}>Search</button>
          {showDropdown && suggestions.length > 0 && (
            <div className="dropdown-home">
              {suggestions.map((launch) => (
                <div
                  key={launch.id}
                  className="dropdown-item-home"
                  onMouseDown={async () => {
                    setSearchQuery(launch.name);
                    setShowDropdown(false);
                    await searchLaunch(); // Execute search after setting the query
                  }}
                >
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
        <div className="overlay" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}></div>
        <div className="featured-content" style={{ position: 'relative' }}>
          <div className="featured-text">
            <h3>{searchQuery.trim() && featuredLaunch ? 'Search Result' : 'Featured Launch'}</h3>
            <h2>{featuredLaunch ? featuredLaunch.name : 'Launch Name'}</h2>
            <p>
              {featuredLaunch ? featuredLaunch.details || 'No details available for this launch.' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'}
            </p>
            <div className="button-group">
              {youtubeVideoId ? (
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                featuredLaunch && featuredLaunch.links.webcast && (
                  <a href={featuredLaunch.links.webcast} target="_blank" rel="noopener noreferrer" className="action-button">Watch</a>
                )
              )}
              {featuredLaunch && featuredLaunch.links.article && (
                <Button href={featuredLaunch.links.article}>Article</Button>
              )}
            </div>
          </div>
          <div className="featured-headers">
            <div className="launch-info">
            <h3>LAUNCH DETAILS:</h3>
            {featuredLaunch && (
              <div className="launch-info-content">
                <p><strong>Date:</strong> {new Date(featuredLaunch.date_utc).toLocaleDateString()}</p>
                <p><strong>Landing Attempt:</strong> {featuredLaunch.cores && featuredLaunch.cores[0]?.landing_attempt ? 'Yes' : 'No'}</p>
                <p><strong>Landing Success:</strong> {featuredLaunch.cores && featuredLaunch.cores[0]?.landing_success ? 'Yes' : 'No'}</p>
                <p><strong>Flight Number:</strong> {featuredLaunch.flight_number}</p>
              </div>
            )}
            </div>
            <div className="rocket-info">
            <h3>ROCKET INFO:</h3>
            {rocketInfo && (
              <div className="rocket-info-content">
                <p><strong>Name:</strong> {rocketInfo.name}</p>
                <p><strong>Type of Engine:</strong> {rocketInfo.engines.type}</p>
                <p><strong>Thrust-to-Weight Ratio:</strong> {(rocketInfo.engines.thrust_to_weight || 'N/A')}</p>
                <p><strong>Description:</strong> {rocketInfo.description}</p>
                <p><strong>Cost:</strong> ${rocketInfo.cost_per_launch.toLocaleString()}</p>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      <div className="random-launch-container" style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          className="button"
          onClick={fetchRandomLaunch} // Update to call fetchRandomLaunch function
        >
          Random Launch
        </button>
      </div>
    </div>
  );
};

export default HomePage;