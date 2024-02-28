import CustomLayout from './components/customLayout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreatePaddock from './pages/createPaddock';
import AuthProvider from './hooks/authProvider';
import Login from './pages/login';
import ShowPaddocks from './pages/showPaddocks';
import Logout from './pages/logout';
import { ConfigProvider, Typography } from 'antd';

function App() {

  // const {Title, Text} = Typography;
  return (
    <>
      <ConfigProvider theme={{
        token: {
          colorPrimary: "#138510",
          colorInfo: "#138510"
        }
      }}>
        <AuthProvider>
          <BrowserRouter basename='/'>
            <CustomLayout>
                <Routes>
                  {/* <Route path='/' element={<Title level={1}>Home</Title>} />
                  <Route path='/settings' element={<Title level={1}>Settings</Title>} /> */}
                  <Route path='/paddocks/create' element={<CreatePaddock />} />
                  <Route path='/paddocks' element={<ShowPaddocks />} />
                  {/* <Route path='/test' element={<MapComponent />} /> */}
                  <Route path='/login' element={<Login/>}/>
                  <Route path='/logout' element={<Logout/>}/>
                </Routes>
            </CustomLayout>
          </BrowserRouter>
        </AuthProvider>
      </ConfigProvider>
    </>
  )
}

export default App
