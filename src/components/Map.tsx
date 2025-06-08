import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Feature, FeatureCollection } from 'geojson';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Map Nvklass to green shades
function getNvklassColor(nvklass: string | number) {
  switch (nvklass) {
    case 4:
    case '4': return '#a1d99b';
    case 3:
    case '3': return '#41ab5d';
    case 2:
    case '2': return '#238b45';
    case 1:
    case '1': return '#005a32'; // darkest green
    default: return '#e5f5e0'; // fallback gray
  }
}

// Style functions for GeoJSON layers
const nviBiotopesStyle = (feature?: Feature) => ({
  fillColor: getNvklassColor(feature?.properties?.Nvklass),
  fillOpacity: 0.5,
  color: '#225522',
  weight: 2,
});

interface MapProps {
  center?: [number, number];
  zoom?: number;
}

// Component to handle map updates
const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// Function to parse CSV data for management plan
function parseManagementPlanCSV(csvText: string) {
  const lines = csvText.split('\n');
  const managementPlan: any = {
    title: '',
    currentBiotope: '',
    targetBiotope: '',
    timeline: '',
    nviValue: '',
    area: '',
    naturalValueClass: '',
    managementSummary: '',
    actions: [],
    economics: {
      totalCost: '',
      totalIncome: '',
      netResult: ''
    }
  };

  // Parse the structured data from CSV
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cells = line.split(',');
    
    if (i === 0 && cells[1]) {
      managementPlan.title = cells[1];
    }
    
    if (cells[0] === 'Nuvarande biotop' && cells[1]) {
      managementPlan.currentBiotope = cells[1];
    }
    
    if (cells[0] === 'Målbiotop' && cells[1]) {
      managementPlan.targetBiotope = cells[1];
    }
    
    if (cells[0] === 'Tidslinje' && cells[1]) {
      managementPlan.timeline = cells[1];
    }
    
    if (cells[0] === 'Naturvärdesbiotop (NVI)' && cells[1]) {
      managementPlan.nviValue = cells[1];
    }
    
    if (cells[0] === 'Areal (ha)' && cells[1]) {
      managementPlan.area = cells[1];
    }
    
    if (cells[0] === 'Naturvärdesklass' && cells[1]) {
      managementPlan.naturalValueClass = cells[1];
    }
    
    if (cells[0] === 'Skötselsammanfattning' && cells[1]) {
      managementPlan.managementSummary = cells[1];
    }
    
    // Parse actions (lines with 'x' in second column indicating planned actions)
    if (cells[1] === 'x' && cells[0] && cells[0].trim() !== '') {
      managementPlan.actions.push({
        action: cells[0],
        cost20Years: cells[3] || '',
        costPerYear: cells[4] || '',
        costPerHectareYear: cells[5] || ''
      });
    }
    
    // Parse economics
    if (cells[0] === 'Ekonomi' && cells[1] === 'Summa') {
      managementPlan.economics.totalCost = cells[4] || '';
    }
    if (cells[1] === 'Indikatorer: biotoper') {
      managementPlan.economics.totalIncome = cells[4] || '';
    }
    if (cells[2] === 'Netto') {
      managementPlan.economics.netResult = cells[4] || '';
    }
  }
  
  return managementPlan;
}

// Add CSS styles for the management plan popup
const managementPopupStyle = `
.management-popup {
  font-family: Arial, sans-serif;
  max-width: 500px;
  max-height: 600px;
  overflow-y: auto;
}
.management-popup h2 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  border-bottom: 3px solid #27ae60;
  padding-bottom: 8px;
  font-size: 16px;
}
.management-popup h3 {
  margin: 15px 0 8px 0;
  color: #27ae60;
  font-size: 14px;
  border-bottom: 1px solid #bdc3c7;
  padding-bottom: 4px;
}
.management-popup .info-section {
  margin-bottom: 15px;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
}
.management-popup .info-row {
  display: flex;
  margin-bottom: 8px;
}
.management-popup .info-label {
  font-weight: bold;
  color: #34495e;
  margin-right: 10px;
  min-width: 120px;
}
.management-popup .info-value {
  color: #7f8c8d;
  flex: 1;
}
.management-popup .actions-list {
  margin-bottom: 15px;
}
.management-popup .action-item {
  background: #ecf0f1;
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 4px;
  border-left: 4px solid #27ae60;
}
.management-popup .action-text {
  font-size: 13px;
  color: #2c3e50;
  margin-bottom: 4px;
}
.management-popup .action-costs {
  font-size: 11px;
  color: #7f8c8d;
  display: flex;
  gap: 15px;
}
.management-popup .economics {
  background: #e8f5e8;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #27ae60;
}
.management-popup .economics-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
.management-popup .economics-label {
  font-weight: bold;
  color: #27ae60;
}
.management-popup .economics-value {
  color: #2c3e50;
  font-weight: bold;
}
`;

// Add CSS styles for polygon labels
const polygonLabelStyle = `
.polygon-label {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #27ae60;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  color: #c0392b;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  pointer-events: none;
}
`;

// Add CSS styles for fullscreen functionality
const fullscreenStyle = `
body {
  background: #f0f8f0;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.fullscreen-wrapper {
  position: relative;
  height: 80vh;
  width: calc(100% - 120px);
  margin: 20px 60px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  border: 1px solid rgba(34, 85, 34, 0.2);
}

.fullscreen-wrapper.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  border-radius: 0 !important;
  z-index: 9999 !important;
  box-shadow: none !important;
  border: none !important;
}

.fullscreen-wrapper.fullscreen .leaflet-container {
  height: 100vh !important;
}

.fullscreen-control {
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9) !important;
}

.fullscreen-control:hover {
  background: rgba(255, 255, 255, 1) !important;
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(0,0,0,0.2) !important;
}
`;

// Inject management popup style into the document head
function injectManagementPopupStyle() {
  if (!document.getElementById('management-popup-style')) {
    const style = document.createElement('style');
    style.id = 'management-popup-style';
    style.innerHTML = managementPopupStyle;
    document.head.appendChild(style);
  }
}

// Inject polygon label style into the document head
function injectPolygonLabelStyle() {
  if (!document.getElementById('polygon-label-style')) {
    const style = document.createElement('style');
    style.id = 'polygon-label-style';
    style.innerHTML = polygonLabelStyle;
    document.head.appendChild(style);
  }
}

// Inject fullscreen style into the document head
function injectFullscreenStyle() {
  if (!document.getElementById('fullscreen-style')) {
    const style = document.createElement('style');
    style.id = 'fullscreen-style';
    style.innerHTML = fullscreenStyle;
    document.head.appendChild(style);
  }
}

// Add CSS styles for the popup
const popupStyle = `
.nvi-popup {
  font-family: Arial, sans-serif;
  max-width: 300px;
}
.nvi-popup h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  border-bottom: 2px solid #2c3e50;
  padding-bottom: 5px;
}
.nvi-popup .property-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  padding: 3px 0;
  border-bottom: 1px solid #eee;
}
.nvi-popup .property-label {
  font-weight: bold;
  color: #34495e;
  margin-right: 10px;
}
.nvi-popup .property-value {
  color: #7f8c8d;
}
`;

// Inject popupStyle into the document head once
function injectPopupStyle() {
  if (!document.getElementById('nvi-popup-style')) {
    const style = document.createElement('style');
    style.id = 'nvi-popup-style';
    style.innerHTML = popupStyle;
    document.head.appendChild(style);
  }
}

// Function to format property names for better readability
function formatPropertyName(name: string): string {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Function to calculate centroid of a polygon
function calculateCentroid(geometry: any): [number, number] {
  if (geometry.type === 'Polygon') {
    const coordinates = geometry.coordinates[0]; // First ring of the polygon
    let x = 0, y = 0;
    for (const coord of coordinates) {
      x += coord[0]; // longitude
      y += coord[1]; // latitude
    }
    return [y / coordinates.length, x / coordinates.length]; // [lat, lng] for Leaflet
  } else if (geometry.type === 'MultiPolygon') {
    // For MultiPolygon, use the first polygon
    const coordinates = geometry.coordinates[0][0]; // First ring of first polygon
    let x = 0, y = 0;
    for (const coord of coordinates) {
      x += coord[0]; // longitude
      y += coord[1]; // latitude
    }
    return [y / coordinates.length, x / coordinates.length]; // [lat, lng] for Leaflet
  }
  return [0, 0]; // fallback
}
const Map: React.FC<MapProps> = ({ 
  center = [57.538, 15.182], // Center on Ustorp
  zoom = 14 
}) => {
  const [propertyData, setPropertyData] = useState<FeatureCollection | null>(null);
  const [nviBiotopesData, setNviBiotopesData] = useState<FeatureCollection | null>(null);
  const [managementPlansData, setManagementPlansData] = useState<{[key: string]: any}>({});
  const [areasWithManagementPlans, setAreasWithManagementPlans] = useState<FeatureCollection | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Function to load management plans for all available objektids
  const loadManagementPlans = useCallback(async (biotopesData: FeatureCollection) => {
    const managementPlans: {[key: string]: any} = {};
    const areasWithPlans: Feature[] = [];

    // Extract all numeric objektids from the biotopes data
    const objektids = biotopesData.features
      .map(feature => feature.properties?.Objektid)
      .filter(id => id && id !== 'Ej naturvärde' && !isNaN(Number(id)))
      .map(id => String(id));

    // Remove duplicates
    const uniqueObjektids = Array.from(new Set(objektids));

    // Try to load management plan for each objektid
    for (const objektid of uniqueObjektids) {
      try {
        console.log(`Attempting to load management_plan_${objektid}.csv`);
        const response = await fetch(`${process.env.PUBLIC_URL}/data/management_plan_${objektid}.csv`);
        
        if (response.ok) {
          const csvText = await response.text();
          const parsedData = parseManagementPlanCSV(csvText);
          managementPlans[objektid] = parsedData;
          
          // Find the corresponding feature and add it to areasWithPlans
          const feature = biotopesData.features.find(f => f.properties?.Objektid === objektid);
          if (feature) {
            areasWithPlans.push(feature);
            console.log(`Successfully loaded management plan for objektid ${objektid}`);
          }
        } else {
          console.log(`No management plan found for objektid ${objektid} (${response.status})`);
        }
      } catch (error) {
        console.log(`Failed to load management plan for objektid ${objektid}:`, error);
      }
    }

    setManagementPlansData(managementPlans);
    
    // Create a FeatureCollection with all areas that have management plans
    if (areasWithPlans.length > 0) {
      setAreasWithManagementPlans({
        type: 'FeatureCollection',
        features: areasWithPlans
      });
    }

    console.log(`Loaded ${Object.keys(managementPlans).length} management plans for objektids:`, Object.keys(managementPlans));
  }, []);

  // Function to toggle fullscreen mode
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  useEffect(() => {
    // Load Ustorp property borders
    fetch(`${process.env.PUBLIC_URL}/data/ustorp_property_borders.json`)
      .then(response => response.json())
      .then((data: FeatureCollection) => setPropertyData(data))
      .catch((error: Error) => console.error('Error loading property borders:', error));
    // Load NVI biotopes GeoJSON
    fetch(`${process.env.PUBLIC_URL}/data/nvi_biotopes.json`)
      .then(response => response.json())
      .then((data: FeatureCollection) => {
        setNviBiotopesData(data);
        
        // Load management plans for all objektids
        loadManagementPlans(data);
      })
      .catch((error: Error) => console.error('Error loading NVI biotopes:', error));
  }, [loadManagementPlans]);

  const propertyStyle = {
    fillColor: '#3388ff',
    fillOpacity: 0.1,    // reduced opacity to make border more visible
    color: '#ff0000',    // red border
    weight: 3,           // thicker border
  };

  useEffect(() => {
    injectPopupStyle();
    injectManagementPopupStyle();
    injectPolygonLabelStyle();
    injectFullscreenStyle();
  }, []);

  return (
    <div className={`fullscreen-wrapper ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Fullscreen control button - positioned outside MapContainer */}
      <div 
        className="fullscreen-control"
        onClick={toggleFullscreen}
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        style={{ 
          position: 'absolute',
          top: '10px',
          right: isFullscreen ? '60px' : '10px',
          zIndex: 1001,
          background: 'white',
          border: '2px solid rgba(0,0,0,0.2)',
          borderRadius: '4px',
          width: '34px',
          height: '34px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          boxShadow: '0 1px 5px rgba(0,0,0,0.4)',
          transition: 'all 0.2s ease'
        }}
      >
        {isFullscreen ? '⤓' : '⤢'}
      </div>
      
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ 
          height: isFullscreen ? '100vh' : '80vh', 
          width: '100%' 
        }}
      >
        <MapUpdater center={center} zoom={zoom} />
      
              <LayersControl position={isFullscreen ? "topright" : "topleft"}>
      <LayersControl.BaseLayer checked name="Satellite">
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
        
        <LayersControl.BaseLayer name="OpenStreetMap">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        
        
        <LayersControl.BaseLayer name="Terrain">
          <TileLayer
            attribution='&copy; <a href="https://www.stadiamaps.com/">Stadia Maps</a>'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          />
        </LayersControl.BaseLayer>

        <LayersControl.Overlay checked name="NaturaTua Ustorp Boundaries">
          {propertyData && (
            <GeoJSON 
              data={propertyData} 
              style={propertyStyle}
              onEachFeature={(feature: Feature, layer: L.Layer) => {
                if (layer instanceof L.GeoJSON) {
                  layer.bindPopup(`
                    <strong>Property:</strong> ${feature.properties?.name || 'No name available'}
                  `);
                }
              }}
            />
          )}
        </LayersControl.Overlay>

        <LayersControl.Overlay checked name="2024 NVI Baseline">
          {nviBiotopesData && (
            <GeoJSON 
              data={nviBiotopesData} 
              style={nviBiotopesStyle}
              onEachFeature={(feature, layer) => {
                const properties = feature.properties || {};
                const popupContent = `
                  <div class="nvi-popup">
                    <h3>NVI Feature Details</h3>
                    ${Object.entries(properties)
                      .map(
                        ([key, value]) =>
                          `<div class="property-row">
                            <span class="property-label">${formatPropertyName(key)}:</span>
                            <span class="property-value">${value ?? 'N/A'}</span>
                          </div>`
                      )
                      .join('')}
                  </div>
                `;
                layer.bindPopup(popupContent, {
                  maxWidth: 350,
                  maxHeight: 300,
                  autoPan: true,
                });
              }}
            />
          )}
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Management Plans per area" checked>
          {areasWithManagementPlans && (
            <GeoJSON
              data={areasWithManagementPlans}
              style={{
                fillColor: '#e74c3c', // red
                fillOpacity: 0.7,
                color: '#c0392b', // dark red
                weight: 4,
              }}
              onEachFeature={(feature, layer) => {
                const objektid = feature.properties?.Objektid;
                const managementPlan = managementPlansData[objektid];
                
                if (managementPlan) {
                  const popupContent = `
                    <div class="management-popup">
                      <h2>${managementPlan.title}</h2>
                      <div style="margin-bottom: 10px; padding: 5px; background: #3498db; color: white; border-radius: 3px; text-align: center;">
                        <strong>Område ${objektid}</strong>
                      </div>
                      
                      <div class="info-section">
                        <h3>Grundinformation</h3>
                        <div class="info-row">
                          <span class="info-label">Nuvarande biotop:</span>
                          <span class="info-value">${managementPlan.currentBiotope}</span>
                        </div>
                        <div class="info-row">
                          <span class="info-label">Målbiotop:</span>
                          <span class="info-value">${managementPlan.targetBiotope}</span>
                        </div>
                        <div class="info-row">
                          <span class="info-label">Tidslinje:</span>
                          <span class="info-value">${managementPlan.timeline}</span>
                        </div>
                        <div class="info-row">
                          <span class="info-label">Areal:</span>
                          <span class="info-value">${managementPlan.area} ha</span>
                        </div>
                        <div class="info-row">
                          <span class="info-label">Naturvärdesklass:</span>
                          <span class="info-value">${managementPlan.naturalValueClass}</span>
                        </div>
                      </div>

                      <div class="info-section">
                        <h3>Skötselsammanfattning</h3>
                        <div class="info-value">${managementPlan.managementSummary}</div>
                      </div>

                      <div class="actions-list">
                        <h3>Planerade Åtgärder</h3>
                        ${managementPlan.actions.map((action: any) => `
                          <div class="action-item">
                            <div class="action-text">${action.action}</div>
                            <div class="action-costs">
                              <span>20 år: ${action.cost20Years}</span>
                              <span>Per år: ${action.costPerYear}</span>
                              <span>Per ha/år: ${action.costPerHectareYear}</span>
                            </div>
                          </div>
                        `).join('')}
                      </div>

                      <div class="economics">
                        <h3>Ekonomisk Sammanfattning</h3>
                        <div class="economics-row">
                          <span class="economics-label">Total kostnad:</span>
                          <span class="economics-value">${managementPlan.economics.totalCost}</span>
                        </div>
                        <div class="economics-row">
                          <span class="economics-label">Total intäkt:</span>
                          <span class="economics-value">${managementPlan.economics.totalIncome}</span>
                        </div>
                        <div class="economics-row">
                          <span class="economics-label">Netto resultat:</span>
                          <span class="economics-value">${managementPlan.economics.netResult}</span>
                        </div>
                      </div>
                    </div>
                  `;
                  layer.bindPopup(popupContent, {
                    maxWidth: 550,
                    maxHeight: 650,
                    autoPan: true,
                  });
                }
              }}
            />
          )}
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Area Labels" checked>
          {nviBiotopesData && (
            <GeoJSON
              data={nviBiotopesData}
              style={() => ({
                fillOpacity: 0,
                color: 'transparent',
                weight: 0,
              })}
              onEachFeature={(feature, layer) => {
                const objektid = feature.properties?.Objektid;
                
                // Only show labels for numeric objektids (not "Ej naturvärde")
                if (objektid && objektid !== 'Ej naturvärde' && !isNaN(Number(objektid))) {
                  const centroid = calculateCentroid(feature.geometry);
                  const labelIcon = L.divIcon({
                    html: `<div class="polygon-label">${objektid}</div>`,
                    className: 'custom-div-icon',
                    iconSize: [40, 40],
                    iconAnchor: [20, 20]
                  });
                  
                  const labelMarker = L.marker(centroid, { icon: labelIcon });
                  
                  // Add the label marker to the same layer group as the polygon
                  layer.on('add', (e) => {
                    const map = e.target._map;
                    if (map) {
                      labelMarker.addTo(map);
                    }
                  });
                  
                  layer.on('remove', (e) => {
                    const map = e.target._map;
                    if (map && labelMarker) {
                      map.removeLayer(labelMarker);
                    }
                  });
                }
              }}
            />
          )}
        </LayersControl.Overlay>

              </LayersControl>
      </MapContainer>
    </div>
  );
};

export default Map; 