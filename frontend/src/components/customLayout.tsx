import { Layout, Menu, Button, theme, Image, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/authProvider';
import { BuildOutlined, DashboardOutlined, LoginOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import FarmlogLogo from '../assets/FarmLogLogo.png';
import { Claims } from '../models/Claims';
import { jwtDecode } from 'jwt-decode';
import '../styles/main.css';
interface CustomLayoutProps {
  children: React.ReactNode;
}



const { Header, Sider, Content } = Layout;


const CustomLayout: React.FC<CustomLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(true);
    const {
      token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [loggedIn, setLoggedIn] = useState(false)
    const [claims, setClaims] = useState<Claims | null>(null)
    const router = useNavigate();
    const auth = useAuthContext()

    const {Title} = Typography

    const onClickAction = (link: string) => {
      router(link);
      setCollapsed(true);
    }

    useEffect(() => {
      setLoggedIn(auth.isAuthenticated)
      if(auth.isAuthenticated){
        setClaims(Claims.fromJson(jwtDecode(auth.token) as { [key: string]: string }))
      }
    }, [auth.isAuthenticated])

    const loggedInItems = [
        { label: 'Dashboard', key: '/dashboard', icon: <DashboardOutlined />},
        { label: 'Lotes', key: '/fields', icon: <BuildOutlined/> },
        { label: 'Salir', key: '/logout', icon: <LogoutOutlined/> },
    ];
    
    const loggedOutItems = [
        { label: 'Sobre FARMLOG', key: '/', icon: <QuestionCircleOutlined/> },
        { label: 'Ingresar', key: '/login', icon: <LoginOutlined/> }
    ];
    

    return (
      <Layout style={{minWidth: '100vw', minHeight: '100vh'}}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          { !collapsed &&
            <div className='w-100 text-center'>
              <Title level={5} style={{color: 'white'}}>{claims?.name}</Title>
            </div>
          }
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={loggedIn ? loggedInItems : loggedOutItems}
            onClick={({ key }) => onClickAction(key)}
          >
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <Image src={FarmlogLogo} height={55} preview={false}/>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    );
};

export default CustomLayout;
