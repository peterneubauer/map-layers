import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>Partners in Biodiversity Lab</h3>
        <div className="partner-logos">
          <a href="https://framtidensnatur.se/" target="_blank" rel="noopener noreferrer">
            <img 
              src={`${process.env.PUBLIC_URL}/logos/framtidens-natur.svg`} 
              alt="Insamlingsstiftelsen Framtidens Natur & Kulturarv" 
              className="partner-logo partner-logo-brand"
            />
          </a>
          <a href="https://www.almi.se/" target="_blank" rel="noopener noreferrer">
            <img 
              src={`${process.env.PUBLIC_URL}/logos/almi.svg`} 
              alt="Almi" 
              className="partner-logo partner-logo-brand partner-logo-almi"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 