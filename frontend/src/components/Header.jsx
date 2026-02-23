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
  Box,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import sonabelLogo from '../assets/sonabel.png';

const Header = ({ onMenuClick, onLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  
  const handleLogout = () => {
    handleMenuClose();
    if (onLogout) {
      onLogout();
    }
  };

  // Récupérer l'utilisateur connecté
  const user = JSON.parse(localStorage.getItem('user') || '{"username":"Admin"}');

  return (
    <AppBar
      position="fixed"
      sx={{
        width: '100%',
        bgcolor: '#006400',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img 
            src={sonabelLogo} 
            alt="Logo SONABEL" 
            style={{ height: 40, marginRight: 10 }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <Typography variant="h6" noWrap sx={{ fontWeight: 600, color: 'white' }}>
            Gestion du Matériel
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'white', display: { xs: 'none', sm: 'block' } }}>
            {user.username}
          </Typography>
          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: '#FFD700', color: '#006400' }}>
              {user.username?.charAt(0).toUpperCase() || 'A'}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              mt: 1.5,
              borderRadius: 2,
              minWidth: 180
            }
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <PersonIcon sx={{ mr: 1, fontSize: 20, color: '#666' }} />
            Profil
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <SettingsIcon sx={{ mr: 1, fontSize: 20, color: '#666' }} />
            Paramètres
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: '#d32f2f' }}>
            <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
            Déconnexion
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;