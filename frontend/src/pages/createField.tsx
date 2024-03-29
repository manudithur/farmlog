import React, { useState, useEffect, useRef } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { Library } from '@googlemaps/js-api-loader';
import { Button, Divider, Flex, Input, Spin, Typography, notification } from 'antd';
import { Claims } from '../models/Claims';
import { jwtDecode } from 'jwt-decode';
import '../styles/main.css';
import { useNavigate } from 'react-router-dom';
import { createfield } from '../api/fieldApi';
import { getFarm } from '../api/farmApi';



const libraries = ['drawing', 'geometry'] as Library[];


const Createfield: React.FC = () => {

  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);
  const [isPolygonDrawn, setIsPolygonDrawn] = useState(false);
  const [area, setArea] = useState<number | null>(null);
  const [path, setPath] = useState<google.maps.LatLngLiteral[] | null>(null);
  const [fieldName, setfieldName] = useState('');

  const ref = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem('token');
  const claims = Claims.fromJson(jwtDecode(token!));

  const router = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });


  useEffect(() => {
    const loadApp = async () => {
    if (polygon) {
      return () => {
        polygon.setMap(null);
      }
    }

    const farm = await getFarm()
    console.log(farm.center);
    if (isLoaded && ref.current) {
      const map = new window.google.maps.Map(ref.current, {
        center: { lat: farm.center.lat, lng: farm.center.lng },
        zoom: 10,
        mapTypeId: 'hybrid',
        mapTypeControl: false,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_CENTER,
        },
      });

      new window.google.maps.Marker({
        position: { lat: farm.center.lat, lng: farm.center.lng },
        map
      });
  
      const drawingManager = new window.google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: !isPolygonDrawn,
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
      });
  
      drawingManager.setMap(map);
      drawingManager.addListener('overlaycomplete', handleOverlayComplete);
      // Cleanup
      
    }
  }
  loadApp();
  }, [isLoaded, polygon]); // React on isLoaded and polygon changes
  



  const handleOverlayComplete = (e: google.maps.drawing.OverlayCompleteEvent) => {

    if (e.type === google.maps.drawing.OverlayType.POLYGON) {
      const newPolygon = e.overlay as google.maps.Polygon;

      setIsPolygonDrawn(true);
      setArea(google.maps.geometry.spherical.computeArea(newPolygon.getPath()) / 10000); // assuming you want to log the area in hectares
      setPath(newPolygon.getPath().getArray().map(latlng => ({
        lat: latlng.lat(),
        lng: latlng.lng()
      })));
      setPolygon(newPolygon);
    }

  };


  const resetDrawing = () => {
    if (polygon) {
      setPolygon(null);
      setIsPolygonDrawn(false);
      setArea(null);
      setPath(null);
    }
  }

  const createfieldAction = async () => {
    if (!area || !path) {
      notification.info({ message: 'Dibuja un lote primero' })
      return;
    }

    if (!fieldName) {
      notification.info({ message: 'Ingresa un nombre para el lote' })
      return;
    }

    //Get center of the polygon
    const bounds = new window.google.maps.LatLngBounds();
    path.forEach(coord => {
      bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
    });
    const center = bounds.getCenter();

    createfield(path, {lat: center.lat(), lng: center.lng()}, area, fieldName, claims.farmId).then(() => {
      notification.success({ message: 'Lote creado' });
      router('/fields');
    }).catch((error) => {
      console.log(error);
      notification.error({ message: 'Error', description: 'Ha ocurrido un error al crear el lote' })
    })

  }

  return (
    <div style={{padding: 40}}>
      <Spin spinning={!isLoaded} size='large' />
      <Typography.Title level={2}>Crear lote</Typography.Title>
      <Divider />
      <Flex vertical justify='center' align='center' className='w-100'>
        <div
          ref={ref}
          style={{ width: "1000px", height: "700px" }}
        />
        <br></br>
        <div className='w-50 space-around'>
          <Button onClick={resetDrawing} type='dashed'>Eliminar dibujo</Button>
          <Input className='w-50' placeholder='Nombre del lote' value={fieldName} onChange={(e) => setfieldName(e.currentTarget.value)} />

          <Button onClick={createfieldAction} type='primary'>Crear lote</Button>
        </div>
      </Flex>
    </div>
  );
};

export default Createfield;
