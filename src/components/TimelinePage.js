import React, { useEffect, useRef, useState } from 'react';
import { Chart, LineElement, PointElement, LineController, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import '../comp_styles/TimelinePage.css';

// Register ChartJS components
Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Title, Tooltip, Legend);

const TimelinePage = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [launchData, setLaunchData] = useState([]);
  const [chartType, setChartType] = useState('flight_number');

  useEffect(() => {
    const fetchLaunchData = async () => {
      try {
        const response = await fetch('https://api.spacexdata.com/v5/launches');
        const data = await response.json();
        setLaunchData(data);
      } catch (error) {
        console.error('Error fetching launch data:', error);
      }
    };

    fetchLaunchData();
  }, []);

  useEffect(() => {
    if (launchData.length === 0) return;

    const ctx = chartRef.current.getContext('2d');
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = launchData.map(launch => new Date(launch.date_utc).toLocaleDateString());
    let data, title;
    switch (chartType) {
      case 'flight_number':
        data = launchData.map(launch => launch.flight_number);
        title = 'Flight Numbers Over Time';
        break;
      case 'payload_mass':
        data = launchData.map(launch => launch.payloads.reduce((sum, payload) => sum + (payload.mass_kg || 0), 0));
        title = 'Payload Mass Over Time';
        break;
      case 'launch_success':
        data = launchData.map(launch => launch.success ? 1 : 0);
        title = 'Launch Success Over Time';
        break;
      case 'cores_reused':
        data = launchData.map(launch => launch.cores.reduce((sum, core) => sum + (core.reused ? 1 : 0), 0));
        title = 'Cores Reused Over Time';
        break;
      case 'fairings_recovered':
        data = launchData.map(launch => launch.fairings && launch.fairings.recovered ? 1 : 0);
        title = 'Fairings Recovered Over Time';
        break;
      default:
        data = launchData.map(launch => launch.flight_number);
        title = 'Flight Numbers Over Time';
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: title,
          data,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }, [launchData, chartType]);

  return (
    <div className="timeline-page">
      <h1 className="page-title">TIMELINE</h1>
      
      <div className="timeline-filters">
        <button className="filter-button" onClick={() => setChartType('flight_number')}>Flight Number</button>
        <button className="filter-button" onClick={() => setChartType('payload_mass')}>Payload Mass</button>
        <button className="filter-button" onClick={() => setChartType('launch_success')}>Launch Success</button>
        <button className="filter-button" onClick={() => setChartType('cores_reused')}>Cores Reused</button>
        <button className="filter-button" onClick={() => setChartType('fairings_recovered')}>Fairings Recovered</button>
      </div>
      
      <div className="timeline-chart">
        <div className="chart-container" style={{ position: 'relative', height: '100%', width: '100%' }}>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;