import React, { useState } from 'react';
import './App.css';
import Map from './components/Map';
import People from './components/People';
import ProjectOwner from './components/ProjectOwner';
import Partners from './components/Partners';

function App() {
  const [showContact, setShowContact] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent('Contact from ' + contactName);
    const body = encodeURIComponent(`Name: ${contactName}\nEmail: ${contactEmail}\n\n${contactMessage}`);
    window.location.href = `mailto:info@naturatua.com?subject=${subject}&body=${body}`;
    setShowContact(false);
    setContactName('Name');
    setContactEmail('');
    setContactMessage('');
  };

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
          <button className="cta-btn" onClick={() => setShowContact(true)}>Contact Us</button>
          {showContact && (
            <div className="contact-modal" style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <form
                className="contact-form"
                onSubmit={handleContactSubmit}
                style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '10px',
                  minWidth: '300px',
                  maxWidth: '400px',
                  width: '100%',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                  margin: '0 auto'
                }}
              >
                <h2 style={{marginTop: 0, color: '#27ae60', textAlign: 'center'}}>Contact Us</h2>
                <div style={{color: '#333', fontSize: '1rem', marginBottom: '1rem', textAlign: 'center'}}>
                  Fill out the form below to contact us. Your message will be sent to <b>info@naturatua.com</b> and we will get back to you as soon as possible.
                </div>
                <div style={{marginBottom: '0.7rem'}}>
                  <label htmlFor="contact-name" style={{fontWeight: 'bold', display: 'block', marginBottom: '0.2rem', color: '#333', textAlign: 'left'}}>Name</label>
                  <input id="contact-name" type="text" value={contactName} onChange={e => setContactName(e.target.value)} required style={{width: '100%', padding: '0.5rem'}} />
                </div>
                <div style={{marginBottom: '0.7rem'}}>
                  <label htmlFor="contact-email" style={{fontWeight: 'bold', display: 'block', marginBottom: '0.2rem', color: '#333', textAlign: 'left'}}>Email</label>
                  <input id="contact-email" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required style={{width: '100%', padding: '0.5rem'}} />
                </div>
                <div style={{marginBottom: '0.7rem'}}>
                  <label htmlFor="contact-message" style={{fontWeight: 'bold', display: 'block', marginBottom: '0.2rem', color: '#333', textAlign: 'left'}}>Message</label>
                  <textarea id="contact-message" value={contactMessage} onChange={e => setContactMessage(e.target.value)} required rows={4} style={{width: '100%', padding: '0.5rem'}} />
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem'}}>
                  <button type="submit" className="cta-btn" style={{marginRight: '1rem'}}>Send</button>
                  <button type="button" className="cta-btn" style={{background: '#ccc', color: '#222'}} onClick={() => setShowContact(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
      <section className="map-section" id="map-section">
        <Map />
      </section>
      <section className="property-info-section" style={{background: '#f8f9f5', color: '#1e2a1e', padding: '3rem 0', borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0'}}>
        <div style={{maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem'}}>
          <h2 style={{color: '#27ae60', marginBottom: '1.5rem'}}>Property Information</h2>
          <p><strong>Property designation:</strong> Ustorp 1:6</p>
          <p><strong>Property Area:</strong> 50 ha</p>
          <p><strong>Initial Project Area:</strong> 12,7 ha</p>
          <p><strong>Municipality:</strong> Eksjö, Sweden</p>

          <h2 style={{color: '#27ae60', margin: '2.5rem 0 1.5rem'}}>Project Implementation</h2>
          <p>NaturaTua, with the support of an accredited third party, has conducted a Natural Value Inventory (NVI) to establish the area's current biodiversity status ("baseline"). Based on this baseline, the Foundation has developed a tailored management plan for the property.</p>
          <p>In close collaboration with Framtidens Natur & Kulturarv, NaturaTua will provide continuous updates on the measures carried out and the project's progress. Alongside this regular reporting, NaturaTua and its partners are actively working to develop more advanced monitoring methods to better track the outcomes of the implemented conservation efforts.</p>

          <h2 style={{color: '#27ae60', margin: '2.5rem 0 1.5rem'}}>Management Plan Overview</h2>
          <p>The primary goal is to restore semi-open natural pastureland with sparse deciduous forest. To achieve this, spruce trees, birch, and undergrowth will be selectively removed, and drainage ditches will be filled in. Grazing will be reintroduced, and certain areas will be managed as unfertilized meadows without the sowing of fodder crops. Formerly cultivated fields will be transitioned into meadowland, with specific actions taken to enrich plant diversity—such as hay transfer, targeted sowing, and planting of meadow species appropriate to the habitat. The amount of dead wood will be increased to support biodiversity. Nest boxes will be installed to improve conditions for birds and bats. Wet forests will largely be left to develop naturally. The entire project area will be enclosed with fencing.</p>
          <p>By restoring natural pasture and managing meadows without fertilization, while promoting a mix of deciduous tree species, the overall biodiversity is expected to benefit—especially species that are considered threatened or red-listed.</p>
        </div>
      </section>
      <Partners />
      <People />
      <ProjectOwner />

      {/* Add more sections here if needed */}
    </div>
  );
}

export default App;