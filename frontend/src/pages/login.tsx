import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/authProvider";
import { Divider, Flex, Typography, message } from "antd";
import { Button, Form, Input } from 'antd';
import { loginUser } from "../api/userApi";
import '../styles/main.css'
import { Claims } from "../models/Claims";
import { jwtDecode } from "jwt-decode";


const Login: React.FC = () => {

    const auth = useAuthContext();
    const router = useNavigate();
    const {Title, Text} = Typography;


    async function login(values: any) {
        loginUser(values.email, values.password).then((token) => {
            auth.login(token)
            const claims = Claims.fromJson(jwtDecode(token) as { [key: string]: string });
            message.success('Hola ' + claims.name + '!')
            router('/dashboard')
        }).catch((error) => {
            console.log(error)
            message.error(error.response.data.message)
        })
    }

    const onFinishFailed = () => {
        message.error('Ha ocurrido un error al iniciar sesion' )
    };

    return (
        <>
            <Flex justify="center" align="center" vertical className="w-100" style={{height: '50vh'}}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={login}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    className="bg-white p-4 rounded-lg shadow-md w-100"
                >   
                    <Title level={2}>Iniciar Sesion</Title>
                    <span>No tenes usuario? <a onClick={() => window.open('https://wa.me/5491169425755')}>Solicitar demo</a></span>
                    <Divider/>
                    <Text type="secondary" className="w-100">Email</Text>
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Ingrese un email' }]}
                        style={{width: '100%'}}
                    >
                        <Input type="email" />
                    </Form.Item>

                    <Text type="secondary">Contrasena</Text>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Ingrese una contrasena'}, {min: 6, message: 'La contrasena debe tener al menos 6 caracteres'}]}
                    >

                        <Input.Password/>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Ingresar
                        </Button>
                    </Form.Item>
                </Form>
            </Flex>

        </>
    )
}

export default Login;