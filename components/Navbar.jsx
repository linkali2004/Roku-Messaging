"use client";
import * as React from 'react';
import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';

import Image from 'next/image';
import HomeIcon from '@mui/icons-material/Home';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CallIcon from '@mui/icons-material/Call';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from 'next/link';
import { RegistrationContext } from '@/context/RegistrationContext';
import Btn from './Btn';
import LoginIcon from '@mui/icons-material/Login';
import { useRouter } from 'next/navigation';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';


function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {signinSuccess, signupSuccess,isUpdated} = React.useContext(RegistrationContext);
  const [name, setName] = useState("User");
  const router = useRouter();
  async function fetchName() {
    try {
      const response = await fetch('/api/decrypt-name', { method: 'GET' });
      const data = await response.json();
      if (response.ok) {
        setName(data.username);
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error fetching name:', error);
    }
  }

  useEffect(() => {
    fetchName();
  }
, [signinSuccess,signupSuccess,isUpdated]);

  useEffect(() => {
    fetchName();
  }
, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  function redirectToSign() {
    router.push("/credentials");
  }
  return (
    <AppBar position="static" sx={{ backgroundColor: "#070b14" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              <List sx={{ bgcolor: 'black', color: 'white' }}> 
                <ListItem disablePadding>
                  <Link href="/" passHref legacyBehavior>
                    <ListItemButton
                      selected={selectedIndex === 0}
                      onClick={(event) => handleListItemClick(event, 0)}
                      sx={{ color: 'white' }} 
                    >
                      <ListItemIcon>
                        <HomeIcon sx={{ color: 'white' }} />
                      </ListItemIcon>
                      <ListItemText primary="Home" />
                    </ListItemButton>
                  </Link>
                </ListItem>
                <ListItem disablePadding>
                  <Link href="/chat" passHref legacyBehavior>
                    <ListItemButton
                      selected={selectedIndex === 1}
                      onClick={(event) => handleListItemClick(event, 1)}
                      sx={{ color: 'white' }} 
                    >
                      <ListItemIcon>
                        <ChatBubbleIcon sx={{ color: 'white' }} />
                      </ListItemIcon>
                      <ListItemText primary="Chats" />
                    </ListItemButton>
                  </Link>
                </ListItem>
                <ListItem disablePadding>
                  <Link href="/settings" passHref legacyBehavior>
                    <ListItemButton
                      selected={selectedIndex === 3}
                      onClick={(event) => handleListItemClick(event, 3)}
                      sx={{ color: 'white' }} 
                    >
                      <ListItemIcon>
                        <SettingsIcon sx={{ color: 'white' }} />
                      </ListItemIcon>
                      <ListItemText primary="Settings" />
                    </ListItemButton>
                  </Link>
                </ListItem>
              </List>
            </Menu>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
            <Image src="/assets/chat.png" alt="Logo" width={25} height={25} />
            <Typography variant="h6" noWrap component="p" sx={{ ml: 1, color: 'white', fontWeight: 'bold' }}>
              Roku
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {name == "User" ?(<Btn text="Sign up or Login" onClick={redirectToSign} bg="black" variant="contained" icon={<LoginIcon />} />) : (
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Typography sx={{ color: 'white', paddingRight: '8px' }}>
                              {name ? name : 'Loading...'}
                            </Typography>
                          </IconButton>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
