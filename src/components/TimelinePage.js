import React, { useEffect, useRef, useState } from 'react';
import { Chart, LineElement, PointElement, LineController, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import '../comp_styles/TimelinePage.css';

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

    const labels = launchData.map(launch => new Date(launch.date_utc).getFullYear().toString());
    let data, title;
    switch (chartType) {
      case 'flight_number':
        data = launchData.map(launch => launch.flight_number);
        title = 'Flight Numbers Over Time';
        break;
      case 'payload_mass':
        data = launchData.reduce((acc, launch, index) => {
          const payloadCount = launch.payloads.length;
          acc.push((acc[index - 1] || 0) + payloadCount);
          return acc;
        }, []);
        title = 'Cumulative Payloads Launched Over Time';
        break;
      case 'launch_success':
        data = launchData.reduce((acc, launch, index) => {
          const success = launch.success ? 1 : 0;
          acc.push((acc[index - 1] || 0) + success);
          return acc;
        }, []);
        title = 'Cumulative Launch Successes Over Time';
        break;
      case 'cores_reused':
        data = launchData.reduce((acc, launch, index) => {
          const reusedCores = launch.cores.reduce((sum, core) => sum + (core.reused ? 1 : 0), 0);
          acc.push((acc[index - 1] || 0) + reusedCores);
          return acc;
        }, []);
        title = 'Cumulative Cores Reused Over Time';
        break;
      case 'fairings_recovered':
        data = launchData.reduce((acc, launch, index) => {
          const deployedFairings = launch.fairings ? 2 : 0; // 2 fairings are deployed per launch
          acc.push((acc[index - 1] || 0) + deployedFairings);
          return acc;
        }, []);
        title = 'Cumulative Fairings Deployed Over Time';
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
        <button
          className={`filter-button ${chartType === 'flight_number' ? 'current-chart-type' : ''}`}
          onClick={() => setChartType('flight_number')}
        >
          Number of Flights
        </button>
        <button
          className={`filter-button ${chartType === 'payload_mass' ? 'current-chart-type' : ''}`}
          onClick={() => setChartType('payload_mass')}
        >
          Payloads Launched
        </button>
        <button
          className={`filter-button ${chartType === 'launch_success' ? 'current-chart-type' : ''}`}
          onClick={() => setChartType('launch_success')}
        >
          Launch Success
        </button>
        <button
          className={`filter-button ${chartType === 'cores_reused' ? 'current-chart-type' : ''}`}
          onClick={() => setChartType('cores_reused')}
        >
          Cores Reused
        </button>
        <button
          className={`filter-button ${chartType === 'fairings_recovered' ? 'current-chart-type' : ''}`}
          onClick={() => setChartType('fairings_recovered')}
        >
          Fairings Deployed
        </button>
      </div>
      
      <div className="timeline-chart">
          <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default TimelinePage;