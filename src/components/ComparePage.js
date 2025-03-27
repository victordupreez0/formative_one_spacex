import React, { useState, useEffect } from 'react';
import { Pie, Bar, PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, RadialLinearScale } from 'chart.js';
import '../comp_styles/ComparePage.css';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, RadialLinearScale);

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
  const [rocketDetails1, setRocketDetails1] = useState(null);
  const [rocketDetails2, setRocketDetails2] = useState(null);
  const [payloadDetails1, setPayloadDetails1] = useState(null);
  const [payloadDetails2, setPayloadDetails2] = useState(null);

  // Function to fetch suggestions
  const fetchSuggestions = async (query, setSuggestions) => {
    if (!query.trim()) return;

    try {
      const response = await fetch(`https://api.spacexdata.com/v5/launches/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: { name: { $regex: query, $options: 'i' } },
          options: { limit: 100 },
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

  // Function to fetch rocket details
  const fetchRocketDetails = async (rocketId, setRocketDetails) => {
    if (!rocketId) return;

    try {
      const response = await fetch(`https://api.spacexdata.com/v4/rockets/${rocketId}`);
      const data = await response.json();
      setRocketDetails(data);
    } catch (error) {
      console.error('Error fetching rocket details:', error);
    }
  };

  // Function to fetch payload details
  const fetchPayloadDetails = async (payloadId, setPayloadDetails) => {
    if (!payloadId) return;

    try {
      const response = await fetch(`https://api.spacexdata.com/v4/payloads/${payloadId}`);
      const data = await response.json();
      setPayloadDetails(data);
    } catch (error) {
      console.error('Error fetching payload details:', error);
    }
  };

  useEffect(() => {
    if (launch1) {
      fetchRocketDetails(launch1.rocket, setRocketDetails1);
      fetchPayloadDetails(launch1.payloads[0], setPayloadDetails1);
    }
  }, [launch1]);

  useEffect(() => {
    if (launch2) {
      fetchRocketDetails(launch2.rocket, setRocketDetails2);
      fetchPayloadDetails(launch2.payloads[0], setPayloadDetails2);
    }
  }, [launch2]);

  const generateChartData = (payloadDetails) => {
    if (!payloadDetails) {
      return {
        labels: ['RAAN', 'Argument of Pericenter', 'Mean Anomaly'],
        datasets: [
          {
            data: [0, 0, 0, 0],
            backgroundColor: ['#A9A9A9', '#D3D3D3', '#B0C4DE', '#778899'],
            hoverBackgroundColor: ['#A9A9A9', '#D3D3D3', '#B0C4DE', '#778899'],
          },
        ],
      };
    }

    return {
      labels: ['RAAN', 'Argument of Pericenter', 'Mean Anomaly'],
      datasets: [
        {
          data: [
            payloadDetails.raan || 0,
            payloadDetails.arg_of_pericenter || 0,
            payloadDetails.mean_anomaly || 0,
          ],
          backgroundColor: ['#A9A9A9', '#D3D3D3', '#B0C4DE', '#778899'],
          hoverBackgroundColor: ['#A9A9A9', '#D3D3D3', '#B0C4DE', '#778899'],
        },
      ],
    };
  };

  const generateBarChartData = (rocketDetails1, rocketDetails2, payloadDetails1, payloadDetails2) => {
    return {
      labels: ['Rocket Height (m)', 'Rocket Diameter (m)', 'Number of Engines'],
      datasets: [
        {
          label: 'Launch 1',
          data: [
            rocketDetails1?.height?.meters || 0,
            rocketDetails1?.diameter?.meters || 0,
            rocketDetails1?.engines?.number || 0,
          ],
          backgroundColor: '#A9A9A9',
        },
        {
          label: 'Launch 2',
          data: [
            rocketDetails2?.height?.meters || 0,
            rocketDetails2?.diameter?.meters || 0,
            rocketDetails2?.engines?.number || 0,
          ],
          backgroundColor: '#D3D3D3',
        },
      ],
    };
  };

  const generatePolarAreaChartData = (payloadDetails) => {
    return {
      labels: ['Periapsis (km)', 'Apoapsis (km)', 'Semi-Major Axis (km)'],
      datasets: [
        {
          data: [
            payloadDetails?.periapsis_km || 0,
            payloadDetails?.apoapsis_km || 0,
            payloadDetails?.semi_major_axis_km || 0, 
          ],
          backgroundColor: ['#A9A9A9', '#D3D3D3', '#B0C4DE'],
          hoverBackgroundColor: ['#A9A9A9', '#D3D3D3', '#B0C4DE'],
        },
      ],
    };
  };

  return (
    <div className="compare-page">
      <h1 className="page-title">COMPARE</h1>
      <div className="comparison-container">
        
        {/* Left Side */}
        <div className="comparison-side">
          <h2>Launch 1 Lookup</h2>
          <div className="search-container-compare">
            <input
              type="text"
              placeholder="Search Launch 1..."
              className="search-input-compare"
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
            <div className="launch-details" style={{ backgroundImage: `url(${launch1.links.flickr.original})` }}>
              <div className="launch-details-content">
                <h2>{launch1.name}</h2>
                <p>{launch1.details || 'No details available for this launch.'}</p>
                <p><strong>Flight Number:</strong> {launch1.flight_number}</p>
                <p><strong>Date:</strong> {new Date(launch1.date_utc).toLocaleDateString()}</p>
              </div>
            </div>
          )}
          {launch1 && (
            <div className="rocket-id">
              {rocketDetails1 && (
                <div className="rocket-details">
                  <div className="chart-container">
                    <h2>Payload Theoretical Data</h2>
                    <Pie data={generateChartData(payloadDetails1)} />
                  </div>
                  <div className="chart-container">
                  <h2>Payload Orbital Data</h2>
                    <PolarArea data={generatePolarAreaChartData(payloadDetails1)} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Middle Section */}
        <div className="comparison-middle">
          {rocketDetails1 && rocketDetails2 && (
            <>
              <h1 className="vs-text">VS</h1>
              <div className="chart-container" style={{ height: '30%' }}>
              <h2>Rocket Data</h2>
                <Bar
                  data={generateBarChartData(rocketDetails1, rocketDetails2, payloadDetails1, payloadDetails2)}
                  options={{
                    indexAxis: 'y',
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* Right Side */}
        <div className="comparison-side">
          <h2>Launch 2 Lookup</h2>
          <div className="search-container-compare">
            <input
              type="text"
              placeholder="Search Launch 2..."
              className="search-input-compare"
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
            <div className="launch-details" style={{ backgroundImage: `url(${launch2.links.flickr.original})` }}>
              <div className="launch-details-content">
                <h2>{launch2.name}</h2>
                <p>{launch2.details || 'No details available for this launch.'}</p>
                <p><strong>Flight Number:</strong> {launch2.flight_number}</p>
                <p><strong>Date:</strong> {new Date(launch2.date_utc).toLocaleDateString()}</p>
              </div>
            </div>
          )}
          {launch2 && (
            <div className="rocket-id">
              {rocketDetails2 && (
                <div className="rocket-details">
                  <div className="chart-container">
                  <h2>Payload Theoretical Data</h2>
                    <Pie data={generateChartData(payloadDetails2)} />
                  </div>
                  <div className="chart-container">
                  <h2>Payload Orbital Data</h2>
                    <PolarArea data={generatePolarAreaChartData(payloadDetails2)} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparePage;