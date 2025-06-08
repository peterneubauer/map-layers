import React from 'react';

const People: React.FC = () => {
  return (
    <section className="people-section">
      <div className="people-content">
        <h2>The People Behind NaturaTua</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-image">
              <img src="/map-layers/team/peter_neubauer.webp" alt="Peter Neubauer" />
            </div>
            <h3>Peter Neubauer</h3>
            <p className="role">Founder</p>
            <p className="bio">
              Driven and versatile entrepreneur with deep roots in technology and innovation. Founder and technical leader of several successful startups, including <a href="https://www.mapillary.com/" target="_blank" rel="noopener noreferrer">Mapillary</a> and Neo Technology/Neo4j.
            </p>
          </div>
          <div className="team-member">
            <div className="member-image">
              <img src="/map-layers/team/rickard.webp" alt="Rickard Vernet" />
            </div>
            <h3>Rickard Vernet</h3>
            <p className="role">Founder</p>
            <p className="bio">
              Business lawyer specializing in venture capital financing, private funds, climate regulation, legal practice/technology, and corporate governance.
            </p>
          </div>
          <div className="team-member">
            <div className="member-image">
              <img src="/map-layers/team/viktor.webp" alt="Viktor Elliot" />
            </div>
            <h3>Viktor Elliot</h3>
            <p className="role">Initiator</p>
            <p className="bio">
              Lecturer at the School of Business, Economics and Law at the University of Gothenburg, specializing in research and teaching in accounting and finance. Head of the <a href="https://www.sustainablefinance.se/" target="_blank" rel="noopener noreferrer">Swedish Community for Sustainable Finance</a>, researching how biodiversity can be integrated into financial decision-making.
            </p>
          </div>
          <div className="team-member">
            <div className="member-image">
              <img src="/map-layers/team/martin_wolff.webp" alt="Martin Wolff" />
            </div>
            <h3>Martin Wolff</h3>
            <p className="role">Initiator</p>
            <p className="bio">
              Mechanical engineer with a background in the wood industry and many years in product development within telecommunications.
            </p>
          </div>
          <div className="team-member">
            <div className="member-image">
              <img src="/map-layers/team/martin_persson.webp" alt="Martin Persson" />
            </div>
            <h3>Martin Persson</h3>
            <p className="role">Initiator</p>
            <p className="bio">
              Sustainability specialist and asset manager with a focus on sustainable investments and ESG analysis, business development, and ecosystem-supporting innovation.
            </p>
          </div>
          <div className="team-member">
            <div className="member-image">
              <img src="/map-layers/team/sindre.webp" alt="Sindre Magnusson" />
            </div>
            <h3>Sindre Magnusson</h3>
            <p className="role">Chairman of Framtidens Natur & Kulturarv</p>
            <p className="bio">
              Leading the foundation that manages NaturaTua's conservation efforts, ensuring the highest standards in biodiversity protection and restoration.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default People; 