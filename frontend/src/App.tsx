import CustomLayout from './components/customLayout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Createfield from './pages/createField';
import AuthProvider from './hooks/authProvider';
import Login from './pages/login';
import Showfields from './pages/showFields';
import Logout from './pages/logout';
import { Button, ConfigProvider, Result } from 'antd';
import FieldDetails from './pages/fieldDetails';
import Dashboard from './pages/dashboard';
import { PrivateRoute } from './components/PrivateRoute';
import Landing from './pages/landing';

function App() {

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
                   <Route path='/' element={<Landing/>} />
                  {/*<Route path='/settings' element={<Title level={1}>Settings</Title>} /> */}
                  <Route path='/dashboard' element={<PrivateRoute component={Dashboard}/>} />
                  <Route path='/fields/create' element={<PrivateRoute component={Createfield}/>} />
                  <Route path='/fields' element={<PrivateRoute component={Showfields }/>} />
                  <Route path='/fields/:id' element={<PrivateRoute component={FieldDetails} />} />
                  <Route path='/login' element={<Login/>}/>
                  <Route path='/logout' element={<Logout/>}/>
                  <Route path='/*' element={  <Result
                                                status="404"
                                                title="Error"
                                                subTitle="No existe la pagina que buscas."
                                                extra={<Button onClick={() => {window.history.back()}} type='primary'>Volver</Button>}
                                            />} 
                  />
                </Routes>
            </CustomLayout>
          </BrowserRouter>
        </AuthProvider>
      </ConfigProvider>
    </>
  )
}

export default App
