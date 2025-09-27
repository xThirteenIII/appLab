import { ChakraProvider, Box, createSystem, defaultConfig, defineConfig} from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './sidebar';
import AppliancesPage from './AppliancesPage';
import ProfilePage from './ProfilePage';
import { ColorModeButton } from './components/ui/color-mode';


const config = defineConfig({
    theme: {
        tokens: {
            colors: {
                primary: {value: '#390099'},
                secondary: {value: '#c77dff'},
            },
        },
        semanticTokens: {
            colors: {
                myColor: {
                    value: { base: '{colors.primary}', _dark: '{colors.secondary}'},
                },
            },
        },
    },
});

const system = createSystem(defaultConfig, config);

function App() {

  return (
    // Wrap ChakraProvider at the root of my app
    // minHeight on the Box ensures it covers the whole page.
    <ChakraProvider value={system}>
      <Router>
        <Box display="flex" minHeight="100vh" bg="myColor">
        <ColorModeButton />
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
