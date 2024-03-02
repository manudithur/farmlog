import { Button, DatePicker, Divider, Flex, Form, Input, Row, Select, Typography, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { createGroupUpdate } from "../api/groupUpdateApi";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Claims } from "../models/Claims";
import { getPaddocksByFarmId } from "../api/paddockApi";
import { Paddock } from "../models/Paddock";

const UpdateGroup: React.FC = () => {

    const { id } = useParams();
    const router = useNavigate();
    const [option, setOption] = useState('');
    const [paddocks, setPaddocks] = useState<Paddock[]>([]);

    const token = localStorage.getItem('token');
    const claims = Claims.fromJson(jwtDecode(token as string ));

    useEffect(() => {
        getPaddocksByFarmId(claims.farmId).then((paddocks) => {
            setPaddocks(paddocks);
        }).catch((error) => {
            message.error(error.message);
        });
    }, [])

    const options = [
        {
            key: 'health',
            label: 'Salud'
        },
        {
            key: 'movement',
            label: 'Movimiento'
        },
        {
            key: 'death',
            label: 'Muerte'
        },
        {
            key: 'birth',
            label: 'Nacimiento'
        }
    ]

    //groupId: string, paddockId: string, type: string, title: string, message: string, date: Date
    const createUpdateAction = (values: any) => {
        if(!id) return message.error('No existe esta categoria');
        createGroupUpdate(id, values.paddockId, values.type, values.title, values.message, values.date).then(() => {
            message.success('Actualizacion creada');
            router(`/groups/${id}`);
        }).catch((error) => {
            message.error(error.message);
        });
    }

    return (
        <>

        <Flex justify="center">
            <Row justify="center" className="w-100">
                <div className="w-25">
                    <Typography.Title level={2}>Actualizar</Typography.Title>
                    <Divider/>
                    <Form
                        name="createGroup"
                        onFinish={createUpdateAction}
                        autoComplete="off"
                        wrapperCol={{ span: 24 }}
                    >
                        <Form.Item
                            name="date"
                            rules={[{ required: true, message: 'Ingrese una fecha' }]}
                            wrapperCol={{ span: 24 }}
                        >
                            <DatePicker placeholder="Fecha" />
                        </Form.Item>
                        <Form.Item
                            name="type"
                            rules={[{ required: true, message: 'Seleccione un tipo' }]}
                            wrapperCol={{ span: 24 }}
                        >
                            <Select placeholder="Tipo" value={option} onChange={(value) => setOption(value)}>
                                {options.map((option) => <Select.Option key={option.key} value={option.key}>{option.label}</Select.Option>)}
                            </Select>
                        </Form.Item>
                        {
                            option === 'movement' && 
                            <Form.Item
                                name="paddockId"
                                rules={[{ required: true, message: 'Seleccione un lote' }]}
                                wrapperCol={{ span: 24 }}
                            >
                                <Select placeholder="Lote" style={{ width: '100%' }} >
                                    {paddocks.map((paddock) => <Select.Option key={paddock.paddockId} value={paddock.paddockId}>{paddock.name}</Select.Option>)}
                                </Select>
                            </Form.Item>

                        }
                        <Form.Item
                            name="title"
                            rules={[{ required: true, message: 'Ingrese un titulo' }]}
                            wrapperCol={{ span: 24 }}
                        >
                            <Input placeholder="Titulo" />
                        </Form.Item>
                        <Form.Item
                            name="message"
                            rules={[{ message: 'Ingrese un mensaje' }]}
                            wrapperCol={{ span: 24 }}
                        >
                            <Input.TextArea placeholder="Descripcion" />
                        </Form.Item>
                        <Form.Item>
                            <Flex justify="end">
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Crear Actualizacion
                                    </Button>
                                </Form.Item>
                            </Flex>
                        </Form.Item>
                    </Form>
                </div>
            </Row>
        </Flex>

        </>    
    );
} 

export default UpdateGroup;