import { Button, Card, Divider, Form, Input, Row, Select, Typography, message } from "antd"
import { createGroup } from "../api/groupApi"
import { useEffect, useState } from "react";
import { Paddock } from "../models/Paddock";
import { useNavigate } from "react-router-dom";
import { getPaddocksByFarmId } from "../api/paddockApi";
import { jwtDecode } from "jwt-decode";
import { Claims } from "../models/Claims";

import '../styles/main.css'


const CreateGroup: React.FC = () => {

    const [paddocks, setPaddocks] = useState<Paddock[]>([]);
    const router = useNavigate()

    const token = localStorage.getItem('token');
    const claims = Claims.fromJson(jwtDecode(token as string ));


    useEffect(() => {
        getPaddocksByFarmId(claims.farmId).then((paddocks) => {
            setPaddocks(paddocks);
        }).catch((error) => {
            message.error(error.message);
        });
    }, [])

    const createGroupAction = (values: any) => {
        createGroup(values.name, values.liveStockCount, values.paddockId).then((group) => {
            message.success('Categoria creada correctamente');
            router('/groups')
        }).catch((error) => {
            message.error(error.message);
        });

    }

    return (
        <Row justify="center">
            <div className="w-25">
                <Typography.Title level={3}>Crear Categoria</Typography.Title>
                <Divider/>
                <Form 
                    name="createGroup"
                    onFinish={createGroupAction}
                    autoComplete="off"
                    wrapperCol={{ span: 24 }}
                >
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Ingrese un nombre' }]}
                        wrapperCol={{ span: 24 }} // Update this line
                    >
                        <Input placeholder="Nombre" />
                    </Form.Item>
                    <Form.Item
                        name="liveStockCount"
                        rules={[{ required: true, message: 'Ingrese una cantidad' }]}
                        wrapperCol={{ span: 24 }} // Update this line
                    >
                        <Input type="number" placeholder="Cantidad de animales"/>
                    </Form.Item>
                    <Form.Item
                        name="paddockId"
                        rules={[{ message: 'Lote' }]}
                        wrapperCol={{ span: 24 }} // Update this line
                    >
                        <Select placeholder="Lote" style={{ width: '100%' }}> // Add style here
                            {paddocks.map((paddock) => <Select.Option key={paddock.paddockId} value={paddock.paddockId}>{paddock.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Crear Categoria
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Row>
    )
}

export default CreateGroup