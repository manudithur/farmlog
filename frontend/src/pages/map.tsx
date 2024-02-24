import React, { useState } from 'react';
import { GoogleMap, DrawingManager, LoadScript, useLoadScript, useJsApiLoader } from '@react-google-maps/api';
import { Library } from '@googlemaps/js-api-loader';
import { Button } from '@mantine/core';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};


const libraries = ['drawing'] as Library[];

interface LatLng {
  lat: number;
  lng: number;
}

const MapComponent: React.FC = () => {

  const [polygons, setPolygons] = useState<LatLng[][]>([]);

  const {isLoaded, loadError} = useJsApiLoader({
    googleMapsApiKey: 'YOUR_API_KEY',
    libraries,
  })

  return (
    <>
      <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=drawing"></script>
      
        {isLoaded && (
          <>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            mapTypeId="satellite"
            options={{
              mapTypeControl: false, // Hide the map type control
              mapTypeId: 'satellite', // Set the default map type to satellite
            }}
          >
            <DrawingManager
              options={{
                drawingControl: true,
                drawingControlOptions: {
                  position: google.maps.ControlPosition.TOP_CENTER,
                  drawingModes: [
                    google.maps.drawing.OverlayType.POLYGON,
                  ],
                }
              }}
              onOverlayComplete={(e) => {
                if (e.type === google.maps.drawing.OverlayType.POLYGON) {
                  const newPolygon = e.overlay as google.maps.Polygon;
                  const path = newPolygon.getPath().getArray().map(latlng => ({
                    lat: latlng.lat(),
                    lng: latlng.lng()
                  }));
                  setPolygons([...polygons, path]);
                }
              }}
              
            />
          </GoogleMap>
          <Button onClick={() => console.log(polygons)}>Log Polygons</Button>
          <Button onClick={() => {
            const areaInSquareMeters = google.maps.geometry.spherical.computeArea(polygons[0]);
            console.log(areaInSquareMeters/10000);
          }}>Area</Button>
          </>
        )}

    </>
  );
  
};

export default MapComponent;
