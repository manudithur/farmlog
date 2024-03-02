import React, { useState, useEffect, useRef } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { Library } from '@googlemaps/js-api-loader';
import { Claims } from '../models/Claims';
import { jwtDecode } from 'jwt-decode';
import { Button, Divider, Flex, Popconfirm, Row, Skeleton, Table, Typography, notification } from 'antd';

import '../styles/main.css';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { deletePaddock, getPaddocksByFarmId } from '../api/paddockApi';
import { Paddock } from '../models/Paddock';

interface DataType {
  key: string;
  name: string;
  area: string;
}

const libraries = ['drawing', 'geometry'] as Library[];

const ShowPaddocks: React.FC = () => {
  const [paddocks, setPaddocks] = useState<Paddock[]>([]);

  const token = localStorage.getItem('token');

  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<DataType[]>([]);

  const ref = useRef<HTMLDivElement>(null);

  const [selectedTableRows, setSelectedTableRows] = useState<DataType[]>([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const claims = Claims.fromJson(jwtDecode(token!) as { [key: string]: string });

  useEffect(() => {
    if (isLoaded) {
      getPaddocksByFarmId(claims.farmId).then((paddocks) => {
        setPaddocks(paddocks);

        const toRet: DataType[] = []
        paddocks.forEach((paddock) => {
          toRet.push({ key: paddock.paddockId, name: paddock.name, area: paddock.area.toFixed(2) })
        })
        setItems(toRet)
        if (isLoaded && ref.current) { // Check if the API is loaded and the ref is attached
          const map = new window.google.maps.Map(ref.current, {
            center: { lat: paddocks[0].shape[0].lat, lng: paddocks[0].shape[0].lng },
            zoom: 10,
            mapTypeId: 'hybrid',
            mapTypeControl: false,
            mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: google.maps.ControlPosition.TOP_CENTER,
            }
          });

          const drawingManager = new window.google.maps.drawing.DrawingManager({
            drawingControl: false,
            polygonOptions: {
              strokeColor: '#00ff52',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#00ff52',
              fillOpacity: 0.35,
            },
          });

          drawingManager.setMap(map);
          //Add polygons
          paddocks.forEach((paddock) => {
            const polygon = new window.google.maps.Polygon({
              paths: paddock.shape.map((coord) => ({ lat: coord.lat, lng: coord.lng })),
              strokeColor: "blue",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "lightblue",
              fillOpacity: 0.4,
            });
            polygon.setMap(map);
          })

          //Infowindows
          paddocks.forEach((paddock) => {
            const bounds = new window.google.maps.LatLngBounds();

            paddock.shape.forEach(coord => {
              bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
            });

            const center = bounds.getCenter();

            const infowindow = new window.google.maps.InfoWindow({
              content: `<h3>${paddock.name}</h3><p>${paddock.area.toFixed(2)} hectareas</p>`
            });

            const marker = new window.google.maps.Marker({
              position: { lat: center.lat(), lng: center.lng() },
              map,
              title: paddock.name
            });

            marker.addListener('click', () => {
              infowindow.open(map, marker);
            });


          })

        }
        setIsLoading(false);
      }).catch((error) => {
        console.error(error);
      });
    }


  }

    , [isLoaded])


  const confirm = (e: React.MouseEvent<HTMLElement> | undefined) => {
    selectedTableRows.forEach((paddock) => {
      deletePaddock(paddock.key).then(() => {
        notification.success({ message: `${paddock.name} eliminado` })
      }).catch((error) => {
        notification.error({ message: `Error al eliminar ${paddock.name}, ${error}` })
      })
    })
    setItems(items.filter((item) => !selectedTableRows.includes(item)))
  }



  return (
    <>
      <Typography.Title level={2}>Ver lotes</Typography.Title>
      <Divider />
      <Skeleton loading={isLoading && !isLoaded}>
        <Flex justify='space-evenly' align='start'>
          {
            paddocks.length == 0 &&
            <Row className='w-100 flex-center mb-5'>
              <Typography.Text type='secondary'>No hay lotes para mostrar</Typography.Text>
              <Button type='primary' href='/paddocks/create'>Crear Lote <PlusCircleOutlined /></Button>
            </Row>
          }
          <Row className='space-evenly w-100 align-start flex-center'>
            <div style={{ width: '40%' }}>
              <div
                ref={ref}
                style={{ width: "40vw", height: "60vh" }}
              />
            </div>
            <div style={{ width: '40%' }}>
              {
                paddocks.length != 0 &&
                <>
                  <Row className='w-100 flex-end mb-5'>
                    <Button type='primary' href='/paddocks/create'>Crear Lote <PlusCircleOutlined /></Button>
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
                        <Popconfirm
                          title="Eliminar lote(s)?"
                          description="Esta accion no se puede deshacer, estas seguro?"
                          onConfirm={confirm}
                          okText="Si"
                          cancelText="No"
                        >
                          <Button danger>Eliminar <DeleteOutlined /></Button>
                        </Popconfirm>
                      </Row>
                      :
                      null
                  }
                </>


              }

            </div>
          </Row>
        </Flex>
      </Skeleton>

    </>
  );
};

export default ShowPaddocks;
