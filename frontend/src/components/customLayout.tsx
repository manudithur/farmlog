import { Layout, Menu, Button, theme, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/authProvider';
import { BuildOutlined, DashboardOutlined, LoginOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, QuestionCircleOutlined } from '@ant-design/icons';

interface CustomLayoutProps {
  children: React.ReactNode;
}

const loggedInItems = [
    { label: 'Dashboard', key: '/dashboard', icon: <DashboardOutlined />},
    { label: 'Lotes', key: '/fields', icon: <BuildOutlined/> },
    { label: 'Salir', key: '/logout', icon: <LogoutOutlined/> },
];

const loggedOutItems = [
    { label: 'Sobre FARMLOG', key: '/about', icon: <QuestionCircleOutlined/> },
    { label: 'Ingresar', key: '/login', icon: <LoginOutlined/> }
];

const { Header, Sider, Content } = Layout;

const CustomLayout: React.FC<CustomLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const {
      token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [loggedIn, setLoggedIn] = useState(false)

    const router = useNavigate();
    const auth = useAuthContext()


    const onClickAction = (link: string) => {
      router(link);
      setCollapsed(true);
    }

    useEffect(() => {
      setLoggedIn(auth.isAuthenticated)
    }, [auth.isAuthenticated])

    return (
      <Layout style={{minWidth: '100vw', minHeight: '100vh'}}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={loggedIn ? loggedInItems : loggedOutItems}
            onClick={({ key }) => onClickAction(key)}
          />
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
            <Image src='/FarmLogLogo.png' height={55} preview={false}/>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
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
