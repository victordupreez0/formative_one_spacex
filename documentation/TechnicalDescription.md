#  Technical Description

##  Application Overview

This app is a React-based data visualization application that allows users to explore and compare launch data provided by the public [SpaceX API](https://github.com/r-spacex/SpaceX-API). The app enables users to view details of individual launches, compare multiple launches across metrics (e.g., payload mass, launch success), and explore a timeline of historical launches.

The project was developed using:

- **React** (frontend framework)
- **Chart.js** (visualizations via react-chartjs-2)
- **React Router** (page routing)
- **Fetch API** (for HTTP requests to the SpaceX API)

---

##  API Integration

The app consumes data from the SpaceX REST API (`https://github.com/r-spacex/SpaceX-API`) and related endpoints (e.g., rockets, payloads). These endpoints return launch metadata including:

- Launch name and date  
- Rocket used  
- Payload information (mass, orbit, etc.)  
- Launch success/failure  
- Associated media links  

---

##  Visualizations

The app leverages **Chart.js** to render dynamic, interactive visualizations. These include:

- **Bar Charts**: For side-by-side comparison of payload masses.
- **Line Charts**: To visualize launch success trends over time.

---

##  Component Structure

Main components include:

- `App.js`: Sets up routing.
- `HomePage.js`: Displays recent or featured launches.
- `ComparePage.js`: Allows user to select and compare multiple launches.
- `TimelinePage.js`: Renders launches in chronological sequence.
- `LaunchList.js`: Lists all recent launches on the home page.

---

##  Assumptions & Limitations

- The app assumes all relevant SpaceX data is available through the public API and does not include fallback handling for API downtime or rate limiting.
- Only desktop and large screen responsiveness is currently supported.
- No authentication or user-specific state is implemented (i.e., public data only)