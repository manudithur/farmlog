import CustomLayout from './components/customLayout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreatePaddock from './pages/createPaddock';
import AuthProvider from './hooks/authProvider';
import Login from './pages/login';
import ShowPaddocks from './pages/showPaddocks';
import Logout from './pages/logout';
import { ConfigProvider, Typography } from 'antd';
import ShowGroups from './pages/showGroups';
import CreateGroup from './pages/createGroup';
import GroupDetails from './pages/groupDetails';
import UpdateGroup from './pages/updateGroup';

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
                  <Route path='/login' element={<Login/>}/>
                  <Route path='/logout' element={<Logout/>}/>
                  <Route path='/groups' element={<ShowGroups/>}/>
                  <Route path='/groups/create' element={<CreateGroup/>}/>
                  <Route path='/groups/:id' element={<GroupDetails/>}/>
                  <Route path='/groups/:id/update' element={<UpdateGroup/>}/>
                </Routes>
            </CustomLayout>
          </BrowserRouter>
        </AuthProvider>
      </ConfigProvider>
    </>
  )
}

export default App
