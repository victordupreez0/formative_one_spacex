import React, { useState, useEffect } from 'react';
import Button  from './Button';
import '../comp_styles/LaunchList.css';

const LaunchList = () => {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rocketDetails, setRocketDetails] = useState({});

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        setLoading(true);
        // Fetch launches from the SpaceX API
        const response = await fetch('https://api.spacexdata.com/v4/launches');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter launches up to 2019 and exclude upcoming launches
        const filteredLaunches = data.filter(launch => {
          const launchDate = new Date(launch.date_utc);
          return launchDate.getFullYear() <= 2019 && launch.success !== null;
        });
        
        // Sort by date (newest first) and get the most recent ones
        const sortedLaunches = filteredLaunches
          .sort((a, b) => new Date(b.date_utc) - new Date(a.date_utc))
          .slice(0, 7); // Get the 7 most recent launches
        
        setLaunches(sortedLaunches);
        
        // Fetch rocket details for all rockets in the launches
        const rocketIds = [...new Set(sortedLaunches.map(launch => launch.rocket))];
        await fetchRocketDetails(rocketIds);
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching launches:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRocketDetails = async (rocketIds) => {
      const details = {};
      
      for (const id of rocketIds) {
        try {
          const response = await fetch(`https://api.spacexdata.com/v4/rockets/${id}`);
          if (response.ok) {
            const data = await response.json();
            details[id] = data;
          }
        } catch (err) {
          console.error(`Error fetching details for rocket ${id}:`, err);
        }
      }
      
      setRocketDetails(details);
    };

    fetchLaunches();
  }, []);

  if (loading) return <div className="loading">Loading launches...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (launches.length === 0) return <div className="no-launches">No launches found.</div>;

  return (
    <div className="launch-container">
      <h2 className="section-title">RECENT LAUNCHES</h2>
      <div className="launch-list">
        {launches.map(launch => (
          <div key={launch.id} className="launch-card">
            <div className="launch-image">
              {launch.links?.patch?.small ? (
                <img src={launch.links.flickr.original} alt={`${launch.name} mission patch`} />
              ) : (
                <div className="placeholder-image">X</div>
              )}
            </div>
            <div className="launch-content">
              <h3 className="launch-name">{launch.name}</h3>
              <p className="rocket-name">{rocketDetails[launch.rocket]?.name || "ROCKET"}</p>
              <p className="mission-outcome">
                {launch.success === null ? "UPCOMING" : launch.success ? "SUCCESS" : "FAILURE"}
              </p>
              <p className="launch-description">
                {launch.details || "No details available for this launch."}
              </p>
              <Button href={launch.links.article}>Details</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LaunchList;