import api from "../api/config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/authProvider";
import { notification } from "antd";
import { Button, Checkbox, Form, Input } from 'antd';


type FieldType = {
    email?: string;
    password?: string;
};


const Login: React.FC = () => {

    const auth = useAuthContext();
    const router = useNavigate();

    const [error, setError] = useState('')

    const [notificationApi, contextHolder] = notification.useNotification();

    async function login(values: any) {
        api.post('/users/login', values).then((response) => {
            auth.login(response.data.token)
            notificationApi.success({ message: 'Has iniciado sesion correctamente', description: 'Bienvenido a FARMLOG' })
            router('/dashboard')
        }).catch((error) => {
            console.log(error)
            setError(error.response.data.message)
            notificationApi.error({ message: 'Error', description: 'Ha ocurrido un error al iniciar sesion' })
        })
    }

    const onFinishFailed = (errorInfo: any) => {
        notificationApi.error({ message: 'Error', description: 'Ha ocurrido un error al iniciar sesion' })
      };

    return (
        <>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={login}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Ingrese un email' }]}
                >
                    <Input type="email" />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Contrasena"
                    name="password"
                    rules={[{ required: true, message: 'Ingrese una contrasena'}, {min: 6, message: 'La contrasena debe tener al menos 6 caracteres'}]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Ingresar
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default Login;