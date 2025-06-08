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
            NaturaTua has been working on establishing a test area of 50 hectares in Southern Sweden in order to be able to test the effect of active management with our partner, the foundation <a href="https://framtidensnatur.se/" style={{ color: 'white' }}>Framtidens Natur och Kulturarv</a>.
          </p>
          <p>
            Join forces with NaturaTua and our partners to assess, plan, implement and monitor the restoration of biodiversity. The lab is a platform for testing and learning about the effect of active management on biodiversity.
          </p>
          <a className="cta-btn" href="#map-section">Explore the Lab</a>
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