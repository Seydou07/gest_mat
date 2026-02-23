// components/Header.jsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box
} from '@mui/material';
import sonabelLogo from '../assets/sonabel.png'; // Vérifie le chemin

const Header = ({ drawerWidth }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        bgcolor: '#006400', // Vert SONABEL
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img src={sonabelLogo} alt="Logo SONABEL" style={{ height: 40, marginRight: 10 }} />
          <Typography variant="h6" noWrap sx={{ fontWeight: 600, color: 'white' }}>
            Gestion du Matériel
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'white' }}>
            Admin
          </Typography>
          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: '#FFD700', color: '#006400' }}>A</Avatar>
          </IconButton>
        </Box>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>Profil</MenuItem>
          <MenuItem onClick={handleMenuClose}>Paramètres</MenuItem>
          <MenuItem onClick={handleMenuClose}>Déconnexion</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;