import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Polygon, InfoWindow } from '@react-google-maps/api';
import api from '../api/config';
import { Library } from '@googlemaps/js-api-loader';
import { Claims } from '../models/Claims';
import { jwtDecode } from 'jwt-decode';
import { Button, Divider, Flex, Row, Skeleton, Table, Typography, notification } from 'antd';

import '../styles/main.css';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';

const containerStyle = {
  width: '30vw',
  height: '40vh'
};

interface PaddockShape {
  lat: number;
  lng: number;
}

interface Paddock {
  farmId: string;
  name: string;
  area: number;
  shape: PaddockShape[];
  paddockId: string;
}

interface ApiResponse {
  message: string;
  paddocks: Paddock[];
}

interface PaddockWithCenter extends Paddock {
  center?: google.maps.LatLngLiteral;
}

interface DataType {
  key: string;
  name: string;
  area: string;
}

const libraries = ['drawing', 'geometry'] as Library[];

const ShowPaddocks: React.FC = () => {
  const [paddocks, setPaddocks] = useState<Paddock[]>([]);

  const token = localStorage.getItem('token');

  const [selectedPaddock, setSelectedPaddock] = useState<PaddockWithCenter | null>(null);
  const [center, setCenter] = useState({ lat: -34, lng: -58 });
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<DataType[]>([]);

  const [selectedTableRows, setSelectedTableRows] = useState<DataType[]>([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const claims = Claims.fromJson(jwtDecode(token!) as { [key: string]: string });
  
  useEffect(() => {
    api.get<ApiResponse>(`/paddocks/farm/${claims.farmId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setPaddocks(response.data.paddocks);
      setCenter({ lat: response.data.paddocks[0].shape[0].lat, lng: response.data.paddocks[0].shape[0].lng });
      console.log(response.data.paddocks.length)
      const toRet: DataType[] = []
      response.data.paddocks.forEach((paddock) => {
        toRet.push({key: paddock.paddockId, name: paddock.name, area: paddock.area.toFixed(2)})
      })
      setItems(toRet)
      setIsLoading(false);
    }).catch((error) => {
      console.error(error);
    });

  }, [])

  const handlePaddockClick = (paddock: Paddock) => {
    const bounds = new window.google.maps.LatLngBounds();

    paddock.shape.forEach(coord => {
      bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
    });

    const center = bounds.getCenter();

    setSelectedPaddock({ ...paddock, center: { lat: center.lat(), lng: center.lng() } });
  };

  return (
    <>  
      <Typography.Title level={2}>Ver lotes</Typography.Title>
      <Divider/>
      <Skeleton loading={isLoading && !isLoaded}>
        <Flex justify='space-evenly' align='start'>
          <div style={{width: '40%'}}>
            {isLoaded && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}
                options={{
                  mapTypeControl: false,
                  mapTypeId: 'hybrid',
                  mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: google.maps.ControlPosition.TOP_CENTER,
                  }
                }}
              >
                {paddocks.map((paddock) => (
                  <Polygon
                    key={paddock.paddockId}
                    paths={paddock.shape.map((coord) => ({ lat: coord.lat, lng: coord.lng }))}
                    options={{
                      fillColor: "lightblue",
                      fillOpacity: 0.4,
                      strokeColor: "blue",
                      strokeOpacity: 1,
                      strokeWeight: 2,
                    }}
                    onClick={() => handlePaddockClick(paddock)}
                  />
                ))}
                {selectedPaddock && (
                  <InfoWindow
                    position={selectedPaddock.center as google.maps.LatLngLiteral}

                    onCloseClick={() => setSelectedPaddock(null)}
                  >
                    <div>
                      <h3>{selectedPaddock.name}</h3>
                      <p>{selectedPaddock.area.toFixed(2)} hectareas</p>
                      <Divider></Divider>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            )}
          </div>
          <div style={{width: '40%'}}>
            {
              paddocks.length != 0 ?
                <>
                  <Row className='w-100 flex-end mb-5'>
                    <Button type='primary' href='/paddocks/create'>Crear Lote <PlusCircleOutlined/></Button>
                  </Row>
                  <Table dataSource={items} columns={[
                    {
                      title: 'Nombre',
                      dataIndex: 'name',
                      key: 'name'
                    },
                    {
                      title: 'Area (ha)',
                      dataIndex: 'area',
                      key: 'area'
                    }
                  ]}

                  rowSelection={{
                    type: 'checkbox',
                    onSelect: (record, selected, selectedRows) => {
                      setSelectedTableRows(selectedRows)
                    },
                    hideSelectAll: true 
                  }}
                  
                  pagination={false}
                  />
                  {
                    selectedTableRows.length > 0 ?
                    <Row className='w-100 flex-end mt-5'>
                      <Button type='dashed' onClick={() => notification.info({message: 'Not implemented yet :)'})}>Eliminar lotes <DeleteOutlined/></Button>
                    </Row>
                    :
                    null
                  }
                </>

                :
                
                <Row className='w-100 flex-center mb-5'>
                    <Typography.Text type='secondary'>No hay lotes para mostrar</Typography.Text>
                    <Button type='primary' href='/paddocks/create'>Crear Lote <PlusCircleOutlined/></Button>
                </Row>
            }
          </div>
        </Flex>
      </Skeleton>

    </>
  );
};

export default ShowPaddocks;
