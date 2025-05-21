import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import AboutPage from './components/ComparePage';
import HomePage from './components/HomePage';
import TimelinePage from './components/TimelinePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/timeline" element={<TimelinePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;