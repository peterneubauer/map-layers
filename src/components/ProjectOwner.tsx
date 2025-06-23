import React from 'react';

const ProjectOwner: React.FC = () => {
  return (
    <section className="about-section" style={{background: '#f8f9f5', color: '#1e2a1e', padding: '1.2rem 0'}}>
      <div className="about-content" style={{maxWidth: '800px', margin: '0 auto', padding: '0 1rem'}}>
        <h2 style={{color: '#27ae60', marginBottom: '0.7rem', marginTop: 0, fontSize: '1.3rem'}}>About the Project Owner & Rights Holder</h2>
        <p style={{marginBottom: '0.4rem', marginTop: 0, fontSize: '0.98rem'}}>NaturaTua started in 2022 and is a for-profit company whose business idea is to buy properties to then offer services – biodiversity units (BDE), aimed at further improving conditions for biodiversity. See more about NaturaTua's method at <a href="https://www.naturatua.com" style={{color: '#41ab5d'}} target="_blank" rel="noopener noreferrer">www.naturatua.com</a></p>
        <p style={{marginBottom: 0, marginTop: 0, fontSize: '0.98rem'}}>Insamlingsstiftelsen Framtidens Natur & Kulturarv was established in 2021. The Foundation is public benefit and non-profit but can conduct business activities. The Foundation aims to protect biodiversity. The Foundation works with all nature types and we view positively the protection of existing values as well as restoration of lost biodiversity. The Foundation gladly combines consistent nature conservation with natural storage of carbon in forest and land. Protection of older forest constitutes a good example of this combined benefit. The Foundation protects cultural heritage environments, in cases where this also harmonizes with biodiversity. The Foundation's website (including statutes) can be found at: <a href="https://www.framtidensnatur.se" style={{color: '#41ab5d'}} target="_blank" rel="noopener noreferrer">www.framtidensnatur.se</a>.</p>
      </div>
    </section>
  );
};

export default ProjectOwner; 