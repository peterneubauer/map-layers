import React from 'react';

// Insamlad bas-data i Ustorp. Bilder och ljud ligger i public/media.
type Item = {
  title: string;
  when: string;
  facts: string[];
  status?: string;
  image?: { src: string; alt: string; caption: string };
  field?: { src: string; alt: string; caption: string }[];  // hur datan samlas in
  audio?: { src: string; caption: string };
};

const M = `${process.env.PUBLIC_URL}/media`;

const items: Item[] = [
  {
    title: 'Nature value survey (NVI)',
    when: 'May 2024 · Ekologigruppen AB',
    facts: [
      'Field survey of the whole property according to Swedish standard SS 199000:2023',
      '31 nature value areas: 3 high (class 2), 14 considerable (class 3), 14 some (class 4)',
      '106 conservation species, of which 16 red-listed and 16 protected',
    ],
    status: 'Baseline',
  },
  {
    title: 'Additional nature value survey',
    when: 'July 2026 · Salmonic AB',
    facts: [
      'Re-assessment of land in the BDU area classed as having no nature value in 2024',
      'About 3.5 ha now has some nature value (class 4): herb-rich regrowth forest, dead wood and old aspens',
      '17 indicator species recorded, and new finds of red-listed burnet moths',
    ],
    status: 'Shown on the map',
  },
  {
    title: 'Sound recordings',
    field: [
      { src: `${M}/field_audiomoth_meadow.jpg`, alt: 'AudioMoth recorder on a stake in the meadow', caption: 'Recorder in the meadow' },
      { src: `${M}/field_audiomoth_forest.jpg`, alt: 'AudioMoth recorder in a weather cover on a tree trunk', caption: 'Recorder in the forest' },
    ],
    when: 'July 2025 · AudioMoth recorders',
    facts: [
      '17,366 one-minute recordings around six sample points',
      'Birds, bats and other sound-producing species, time-stamped for each point',
    ],
    image: { src: `${M}/audiomoth_spectrogram.jpg`, alt: 'Spectrogram of a dawn recording', caption: 'Spectrogram: a bird repeating its song about every ten seconds' },
    audio: { src: `${M}/audiomoth_ue8_20250724_0510.mp3`, caption: 'Listen: dawn at sample point UE8, 24 July 2025, 05:10' },
  },
  {
    title: 'Ground-level panoramas',
    field: [
      { src: `${M}/field_panorama_rig.jpg`, alt: 'Camera on a motorised gimbal and tripod in a clearing', caption: 'Camera on a motorised gimbal' },
      { src: `${M}/diagram_panorama.svg`, alt: 'Diagram: one panorama is 22 by 4 photos', caption: 'How a panorama is built' },
    ],
    when: 'July 2025 · tripod and 24 MP camera',
    facts: [
      '1,584 images: six sample points, three placements per point, 88 images per panorama',
      'Documents plants and the field layer close to the ground',
    ],
    image: { src: `${M}/panorama_sample.jpg`, alt: 'Lichen-covered birch trunk photographed at ground level', caption: 'One of the 88 frames in a panorama: lichens on a birch trunk' },
  },
  {
    title: 'Low-altitude drone imagery',
    field: [{ src: `${M}/diagram_drones.svg`, alt: 'Diagram of the two drone altitudes', caption: 'Low and high flights cover different scales' }],
    when: 'July 2025 · about 5 m above ground',
    facts: [
      '1,022 georeferenced images over one-hectare blocks around five sample points',
      'Detail on trees, shrubs and low-growing plants',
    ],
    image: { src: `${M}/low_drone_sample.jpg`, alt: 'Tree crowns seen from a low-flying drone', caption: 'Tree crowns from a low-altitude flight' },
  },
  {
    title: 'Whole-property drone imagery',
    when: '2025 · about 120 m above ground',
    facts: [
      '4,455 georeferenced images covering the whole property',
      'Basis for 3D reconstruction of trees and habitat structure',
    ],
    image: { src: `${M}/high_drone_sample.jpg`, alt: 'Meadows, forest edge and a gravel road seen from above', caption: 'Meadows and forest edge from the whole-property flight' },
  },
  {
    title: 'Environmental DNA (eDNA)',
    field: [
      { src: `${M}/field_malaise_trap.jpg`, alt: 'Malaise insect trap at the forest edge', caption: 'Malaise trap at the forest edge' },
      { src: `${M}/diagram_edna.svg`, alt: 'Diagram: from field sample to species list', caption: 'From sample to species list' },
    ],
    when: 'June–September 2026 · with FinBIO and Artdatabanken',
    facts: [
      '12 weeks of sampling at four sites in the BDU area',
      'Four Malaise traps for insects and 40 soil samples, substrate changed weekly',
    ],
    status: 'Results expected spring 2027',
  },
  {
    title: 'Tree and forest structure analysis',
    when: '2026 · Conifer Vision',
    facts: ['AI analysis of the drone imagery, focusing on tree species and forest structure'],
    status: 'Results expected autumn 2026',
  },
];

const BaselineData: React.FC<{ onContact?: () => void }> = ({ onContact }) => (
  <section className="baseline-section" id="baseline-data">
    <div className="baseline-content">
      <h2>Baseline data collected in Ustorp</h2>
      <p className="baseline-intro">
        Since 2024 we have documented the biodiversity of Ustorp with several complementary methods. Together they form the
        baseline that the conservation work will be followed up against. Here is what has been captured so far.
      </p>
      <div className="baseline-grid">
        {items.map((it) => (
          <article className="baseline-card" key={it.title}>
            {it.image && (
              <figure className="baseline-media">
                <a href={it.image.src} target="_blank" rel="noopener noreferrer">
                  <img src={it.image.src} alt={it.image.alt} loading="lazy" />
                </a>
                <figcaption>{it.image.caption}</figcaption>
              </figure>
            )}
            <h3>{it.title}</h3>
            <p className="baseline-when">{it.when}</p>
            <ul>{it.facts.map((f) => <li key={f}>{f}</li>)}</ul>
            {it.field && (
              <div className="baseline-field">
                <span className="baseline-field-label">How it is captured</span>
                <div className={`baseline-field-grid n${it.field.length}`}>
                  {it.field.map((f) => (
                    <figure key={f.src}>
                      <a href={f.src} target="_blank" rel="noopener noreferrer"><img src={f.src} alt={f.alt} loading="lazy" /></a>
                      <figcaption>{f.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}
            {it.audio && (
              <figure className="baseline-audio">
                <audio controls preload="none" src={it.audio.src} />
                <figcaption>{it.audio.caption}</figcaption>
              </figure>
            )}
            {it.status && <span className="baseline-status">{it.status}</span>}
          </article>
        ))}
      </div>
      <div className="baseline-collab">
        <h3>Let's collaborate on the science</h3>
        <p>
          We are very open to research collaborations on biodiversity monitoring, and to sharing and analysing this data
          together with researchers, students and other organisations. If you are interested in the data or in working with
          us in Ustorp, please get in touch.
        </p>
        <button className="cta-btn" onClick={onContact}>Contact us</button>
      </div>
    </div>
  </section>
);

export default BaselineData;
