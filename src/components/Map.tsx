import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import * as shp from 'shpjs';
import proj4 from 'proj4';
import { Feature, FeatureCollection } from 'geojson';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// SWEREF99 TM (EPSG:3006) and WGS84 definitions
const sweref99tm = '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
const wgs84 = 'EPSG:4326';

function reprojectCoord(coord: [number, number]) {
  return proj4(sweref99tm, wgs84, coord);
}

function reprojectGeometry(geometry: any) {
  if (geometry.type === 'Point') {
    geometry.coordinates = reprojectCoord(geometry.coordinates);
  } else if (geometry.type === 'LineString' || geometry.type === 'MultiPoint') {
    geometry.coordinates = geometry.coordinates.map(reprojectCoord);
  } else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
    geometry.coordinates = geometry.coordinates.map((ring: any) => ring.map(reprojectCoord));
  } else if (geometry.type === 'MultiPolygon') {
    geometry.coordinates = geometry.coordinates.map((poly: any) =>
      poly.map((ring: any) => ring.map(reprojectCoord))
    );
  }
  return geometry;
}

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

// Style function for shapefile features
const shapefileStyle = (feature?: Feature) => {
  const nvklass = feature?.properties?.Nvklass;
  return {
    fillColor: getNvklassColor(nvklass),
    fillOpacity: 0.5,
    color: '#225522',
    weight: 2,
  };
};

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

// Add CSS styles for the popup
const popupStyle = `
<style>
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
</style>
`;

// Function to format property names for better readability
function formatPropertyName(name: string): string {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
const Map: React.FC<MapProps> = ({ 
  center = [57.538, 15.182], // Center on Ustorp
  zoom = 14 
}) => {
  const [propertyData, setPropertyData] = useState<FeatureCollection | null>(null);
  const [shapefileData, setShapefileData] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    // Load Ustorp property borders
    fetch('/data/ustorp_property_borders.json')
      .then(response => response.json())
      .then((data: FeatureCollection) => setPropertyData(data))
      .catch((error: Error) => console.error('Error loading property borders:', error));

    // Load Shapefile data
    fetch('/data/NVI_Eksjo_Geodata_250402.zip')
      .then(response => response.arrayBuffer())
      .then(buffer => shp.parseZip(buffer))
      .then((data) => {
        const featureCollection = Array.isArray(data) ? data[0] : data;
        // Reproject all features from SWEREF99 TM to WGS84
        featureCollection.features = featureCollection.features.map((feature: any) => ({
          ...feature,
          geometry: reprojectGeometry(feature.geometry),
        }));
        setShapefileData(featureCollection);
      })
      .catch((error: Error) => {
        console.error('Error loading Shapefile:', error);
        if (error instanceof Error) {
          console.error('Error details:', error.message);
        }
      });
  }, []);

  const propertyStyle = {
    fillColor: '#3388ff',
    fillOpacity: 0.1,    // reduced opacity to make border more visible
    color: '#ff0000',    // red border
    weight: 3,           // thicker border
  };

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: '100vh', width: '100%' }}
    >
      <MapUpdater center={center} zoom={zoom} />
      
      <LayersControl position="topright">
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

        <LayersControl.Overlay checked name="NVI 2024 Data">
          {shapefileData && (
            <GeoJSON 
              data={shapefileData} 
              style={shapefileStyle}
              onEachFeature={(feature, layer) => {
                const properties = feature.properties || {};
                const popupContent = `
                  <div style="font-family: Arial, sans-serif; max-width: 300px;">
                    <h3 style="margin:0 0 10px 0; color:#2c3e50; border-bottom:2px solid #2c3e50; padding-bottom:5px;">
                      NVI Feature Details
                    </h3>
                    ${Object.entries(properties)
                      .map(
                        ([key, value]) =>
                          `<div style="display:flex;justify-content:space-between;margin-bottom:5px;padding:3px 0;border-bottom:1px solid #eee;">
                            <span style="font-weight:bold;color:#34495e;margin-right:10px;">${formatPropertyName(key)}:</span>
                            <span style="color:#7f8c8d;">${value ?? 'N/A'}</span>
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
      </LayersControl>
    </MapContainer>
  );
};

export default Map; 