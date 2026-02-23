// components/Sidebar.jsx
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { NavLink } from 'react-router-dom';

// Icônes
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import BuildIcon from '@mui/icons-material/Build';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import StoreIcon from '@mui/icons-material/Store';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import HistoryIcon from '@mui/icons-material/History';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Agents', icon: <PeopleIcon />, path: '/agents' },
  { text: 'Projets', icon: <WorkIcon />, path: '/projets' },
  { text: 'Matériels', icon: <BuildIcon />, path: '/materiels' },
  { text: 'Affectations', icon: <SwapHorizIcon />, path: '/affectations' },
  { text: 'Magasins', icon: <StoreIcon />, path: '/magasins' },
  { text: 'Marques', icon: <CategoryIcon />, path: '/marques' },
  { text: 'PV Réception', icon: <DescriptionIcon />, path: '/pv' },
  { text: 'Historique', icon: <HistoryIcon />, path: '/historique' },
];

const Sidebar = ({ drawerWidth, mobileOpen, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const drawer = (
    <Box sx={{ overflow: 'auto', mt: 2 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={isMobile ? onClose : undefined}
              sx={{
                mx: 1,
                borderRadius: 1,
                color: '#555',
                '&.active': {
                  bgcolor: '#e8f0fe',
                  color: '#006400',
                  '& .MuiListItemIcon-root': {
                    color: '#006400',
                  },
                },
                '&:hover': {
                  bgcolor: '#f0f0f0',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#777', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            bgcolor: '#f8f9fa',
            top: '64px',
            height: 'calc(100% - 64px)'
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            bgcolor: '#f8f9fa',
            borderRight: '1px solid #e0e0e0',
            boxShadow: 'none',
            top: '64px',
            height: 'calc(100% - 64px)'
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;