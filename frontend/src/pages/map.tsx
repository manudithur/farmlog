import React, { useState, useEffect } from 'react';
import { GoogleMap, DrawingManager, useJsApiLoader } from '@react-google-maps/api';
import { Button, Text, Title } from '@mantine/core';
import { Library } from '@googlemaps/js-api-loader';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

const libraries = ['drawing'] as Library[];

const MapComponent: React.FC = () => {
  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);
  const [isPolygonDrawn, setIsPolygonDrawn] = useState(false);
  const [area, setArea] = useState<number | null>(null);
  const [path, setPath] = useState<google.maps.LatLngLiteral[] | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  useEffect(() => {
    // This effect ensures the polygon is removed from the map when polygon state is set to null
    return () => {
      if (polygon) {
        polygon.setMap(null);
      }
    };
  }, [polygon]); // Depend on the polygon state

  const handleOverlayComplete = (e: google.maps.drawing.OverlayCompleteEvent) => {
    if (e.type === google.maps.drawing.OverlayType.POLYGON) {
      const polygon = e.overlay as google.maps.Polygon;
      setPolygon(polygon);
      setIsPolygonDrawn(true);
      setArea( google.maps.geometry.spherical.computeArea(polygon.getPath()) / 10000); // assuming you want to log the area in hectares
      setPath(polygon.getPath().getArray().map(latlng => ({
        lat: latlng.lat(),
        lng: latlng.lng()
      })));
    }
  };

  const resetDrawing = () => {
    // This directly manipulates the map to remove the polygon
    if (polygon) {
      polygon.setMap(null);
    }
    setPolygon(null);
    setIsPolygonDrawn(false);
    setArea(null);
    setPath(null);
  };

  return (
    <>
      {isLoaded && (
        <>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            options={{
              mapTypeControl: false, // Hide the map type control
              mapTypeId: 'satellite', // Set the default map type to satellite
              mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR, // Set the map type control style to horizontal bar
                position: google.maps.ControlPosition.TOP_CENTER, // Set the position of the map type control to top center
              },
            }}
          >
            <DrawingManager
              options={{
                drawingControl: !isPolygonDrawn,
                drawingControlOptions: {
                  position: google.maps.ControlPosition.TOP_CENTER,
                  drawingModes: [google.maps.drawing.OverlayType.POLYGON],
                },
                polygonOptions: {
                  strokeColor: '#00ff52', // Pink color for the polygon lines
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: '#00ff52',
                  fillOpacity: 0.35,
                },
              }}
              onOverlayComplete={handleOverlayComplete}
            />
          </GoogleMap>
          <br></br>
          <Title order={3}>Area</Title>
          <Text>{area?.toFixed(2)} hectares</Text>
          <br></br>
          <Button onClick={() => {
            if (polygon) {
              const path = polygon.getPath().getArray().map(latlng => ({
                lat: latlng.lat(),
                lng: latlng.lng()
              }));
              console.log(path);
            }
          }}>Log Polygon Path</Button>
          <Button onClick={() => {
            if (polygon) {
              const areaInSquareMeters = google.maps.geometry.spherical.computeArea(polygon.getPath());
              console.log(areaInSquareMeters / 10000); // assuming you want to log the area in hectares
            }
          }}>Calculate Area</Button>
          <Button onClick={resetDrawing}>Reset Drawing</Button>
        </>
      )}
    </>
  );
};

export default MapComponent;
