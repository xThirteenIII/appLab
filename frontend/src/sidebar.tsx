import { Box, List, IconButton} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { PiWashingMachineThin } from 'react-icons/pi';

function Sidebar() {
  return (
    <Box as="nav" w="200px" p={4} borderRight="1px solid #eee" h="100vh" position="sticky" top={0}>
      <List.Root>
        <List.Item>
            <IconButton
              as={NavLink}
              aria-label="Appliances"
              variant="ghost"
              fontSize="24px"
            >
            <PiWashingMachineThin/>
            </IconButton>
        </List.Item>
        <List.Item>
            <IconButton
              as={NavLink}
              aria-label="Profile Analysis"
              variant="ghost"
              fontSize="24px"
            />
        </List.Item>
      </List.Root>
    </Box>
  );
}

export default Sidebar;
