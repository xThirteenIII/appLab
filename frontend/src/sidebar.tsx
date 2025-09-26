import { Box, List, IconButton} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { PiWashingMachine } from 'react-icons/pi';
import { AiOutlineProfile } from 'react-icons/ai';

function Sidebar() {
  return (
    <Box as="nav" w="200px" p={4} borderRight="1px solid #eee" h="100vh" position="sticky" top={0}>
      <List.Root gap={6} listStyle={'none'} justifyContent={'center'} alignContent={'center'}>
        <List.Item>
              <IconButton
                aria-label="Appliances"
                variant="ghost"
                minWidth="4rem"
                minHeight="4rem"
              >
              <NavLink to="/">
                <PiWashingMachine style={{ width: "3rem", height: "3rem" }} />
              </NavLink>
              </IconButton>
        </List.Item>
        <List.Item>
              <IconButton
                aria-label="Appliances"
                variant="ghost"
                minWidth="4rem"
                minHeight="4rem"
              >
              <NavLink to="/profile">
                <AiOutlineProfile style={{ width: "3rem", height: "3rem" }} />
              </NavLink>
              </IconButton>
        </List.Item>
      </List.Root>
    </Box>
  );
}

export default Sidebar;
