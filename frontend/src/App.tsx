import { ChakraProvider, Box, defaultSystem } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './sidebar';
import AppliancesPage from './AppliancesPage';
import ProfilePage from './ProfilePage';

function App() {

  return (
    // Wrap ChakraProvider at the root of my app
    // minHeight on the Box ensures it covers the whole page.
    <ChakraProvider value={defaultSystem}>
      <Router>
        <Box display="flex" minHeight="100vh">
            <Sidebar />
            <Box p={6} flex="5" minHeight="100vh" overflow={"hidden"}>
              <Routes>
                <Route path="/" element={<AppliancesPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </Box>
        </Box>
      </Router>
    </ChakraProvider>
  )
}

export default App;
