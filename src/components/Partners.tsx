import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>Partners in Biodiversity Lab</h3>
        <div className="partner-logos">
          <a href="https://framtidensnatur.se/" target="_blank" rel="noopener noreferrer">
            <img 
              src="/map-layers/logos/framtidens-natur.svg" 
              alt="Framtidens Natur" 
              className="partner-logo"
            />
          </a>
          <a href="https://www.pivotal.earth/" target="_blank" rel="noopener noreferrer">
            <img 
              src="/map-layers/logos/pivotal.svg" 
              alt="Pivotal Earth" 
              className="partner-logo"
            />
          </a>
          <a href="https://www.almi.se/" target="_blank" rel="noopener noreferrer">
            <img 
              src="/map-layers/logos/almi.svg" 
              alt="Almi" 
              className="partner-logo"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 