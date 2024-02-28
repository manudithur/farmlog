import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, DrawingManager, useJsApiLoader } from '@react-google-maps/api';
import { Library } from '@googlemaps/js-api-loader';
import api from '../api/config';
import { Button, Divider, Flex, Input, Skeleton, Spin, Typography, message, notification } from 'antd';
import { Claims } from '../models/Claims';
import { jwtDecode } from 'jwt-decode';
import '../styles/main.css';
import { useNavigate } from 'react-router-dom';
import { createPaddock } from '../api/paddockApi';

const containerStyle = {
  width: '50vw',
  height: '60vh'
};

const center = {
  lat: -34.603709, 
  lng: -58.381647
};

const libraries = ['drawing', 'geometry'] as Library[];


const CreatePaddock: React.FC = () => {

  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);
  const [isPolygonDrawn, setIsPolygonDrawn] = useState(false);
  const [area, setArea] = useState<number | null>(null);
  const [path, setPath] = useState<google.maps.LatLngLiteral[] | null>(null);
  const [paddockName, setPaddockName] = useState('');

  const ref = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem('token');
  const claims = Claims.fromJson(jwtDecode(token!));

  const router = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });


  useEffect(() => {

    if (polygon) {
      return () => {
        polygon.setMap(null);
      }
    }

    if (isLoaded && ref.current) { // Check if the API is loaded and the ref is attached
      const map = new window.google.maps.Map(ref.current, {
        center,
        zoom: 10,
        mapTypeId: 'hybrid',
        mapTypeControl: false,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_CENTER,
        },
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

  const createPaddockAction = async () => {
    if (!area || !path) {
      notification.info({ message: 'Dibuja un lote primero' })
      return;
    }

    if (!paddockName) {
      notification.info({ message: 'Ingresa un nombre para el lote' })
      return;
    }

    createPaddock(path, area, paddockName, claims.farmId).then((paddock) => {
      notification.success({ message: 'Lote creado' });
      router('/paddocks');
    }).catch((error) => {
      console.log(error);
      notification.error({ message: 'Error', description: 'Ha ocurrido un error al crear el lote' })
    })

  }

  return (
    <>
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
          <Input className='w-50' placeholder='Nombre del lote' value={paddockName} onChange={(e) => setPaddockName(e.currentTarget.value)} />

          <Button onClick={createPaddockAction} type='primary'>Crear lote</Button>
        </div>
      </Flex>
    </>
  );
};

export default CreatePaddock;
