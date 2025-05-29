import React from 'react';
import './App.css';
import Map from './components/Map';

function App() {
  return (
    <div className="landing-root">
      <section className="hero">
        <div className="logo-container">
          <img src="/map-layers/naturatua.png" alt="NaturaTua Logo" className="header-title-logo" />
        </div>
        <div className="hero-content">
          <h1>Ustorp - The Biodiversity Lab</h1>
          <p>
            Join forces with NaturaTua and our partners to assess, plan, implement and monitor the restoration of biodiversity.
          </p>
          <a className="cta-btn" href="#map-section">Explore the Map</a>
        </div>
      </section>
      <section className="map-section" id="map-section">
        <Map />
      </section>
      {/* Add more sections here if needed */}
    </div>
  );
}

export default App;