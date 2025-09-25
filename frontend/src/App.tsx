import { ChakraProvider, Box, defaultSystem } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './sidebar';
import AppliancesPage from './AppliancesPage';

function App() {

  return (
    // Wrap ChakraProvider at the root of my app
    <ChakraProvider value={defaultSystem}>
      <Router>
        <Box display="flex">
        <Sidebar />
          <Box p={4} flex={1}>
            <Routes>
              <Route path="/" element={<AppliancesPage />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ChakraProvider>
  )
}

export default App;
