import { Library } from "@googlemaps/js-api-loader";
import { DrawingManager, GoogleMap, useJsApiLoader } from "@react-google-maps/api";


const containerStyle = {
    width: '50vw',
    height: '60vh',
  };
const center = {
  lat: -34,
  lng: -58
};


const libraries = ['drawing', 'geometry'] as Library[];

const MapComponent: React.FC = () => {

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
        libraries,
    });

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
              drawingControl: true,
              drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [google.maps.drawing.OverlayType.POLYGON],
              },
              polygonOptions: {
                strokeColor: '#00ff52',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#00ff52',
                fillOpacity: 0.35,
              },
            }}
          />
        </GoogleMap>
        </>
      )}
    </>
  );
};

export default MapComponent;

