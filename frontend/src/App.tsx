import './App.css'
import '@mantine/core/styles.css';

import { MantineProvider, Title } from '@mantine/core';
import MapComponent from './pages/map';

function App() {
  return (
    <>
      <MantineProvider>
        <MapComponent />
      </MantineProvider>
    </>
  )
}

export default App
