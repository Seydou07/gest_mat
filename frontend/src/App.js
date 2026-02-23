// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Box, CssBaseline, Toolbar, CircularProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

// On utilise VOS nouveaux composants, c'est la bonne façon de faire
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Auth from './pages/auth'; // Importe depuis pages/auth/index.jsx

// On importe VOS nouvelles pages
import DashboardPage from './pages/dashboard';
import AgentsPage from './pages/agents';
import Projets from './pages/projets';
import Materiels from './pages/materiels';
import Affectations from './pages/affectations';
import Magasins from './pages/magasins';
import Marques from './pages/marques';
import Pv from './pages/pv';
import Historique from './pages/historique';
// Les autres pages seront ajoutées ici plus tard

const drawerWidth = 260;

// Petit utilitaire pour gérer la déconnexion proprement
function LogoutManager({ onLogout }) {
  const navigate = useNavigate();
  useEffect(() => {
    onLogout();
    navigate('/login');
  }, [onLogout, navigate]);
  return null;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Si on n'est pas connecté, on voit la page de Login */}
          <Route path="/login" element={!isAuthenticated ? <Auth onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />} />
          
          {/* Si on est connecté, on voit le Layout principal */}
          <Route
            path="/*"
            element={
              isAuthenticated ? (
                <Box sx={{ display: 'flex', height: '100vh' }}>
                  <CssBaseline />
                  <Header onMenuClick={handleDrawerToggle} onLogout={handleLogout} />
                  <Sidebar drawerWidth={drawerWidth} mobileOpen={mobileOpen} onClose={handleDrawerToggle} />
                  <Box
                    component="main"
                    sx={{
                      flexGrow: 1,
                      width: { sm: `calc(100% - ${drawerWidth}px)` },
                      bgcolor: '#f8f8f8', // un gris plus clair
                      overflowY: 'auto',
                    }}
                  >
                    <Toolbar />
                    {/* 
                      CORRECTION FINALE DE LA LARGEUR : 
                      On met le padding ici, DANS la page, pas autour.
                      Chaque page aura son propre padding.
                    */}
                    <Box sx={{ p: { xs: 2, sm: 3 } }}>
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/agents" element={<AgentsPage />} />
                        <Route path="/projets" element={<Projets />} />
                        <Route path="/materiels" element={<Materiels />} />
                        <Route path="/affectations" element={<Affectations />} />
                        <Route path="/magasins" element={<Magasins />} />
                        <Route path="/marques" element={<Marques />} />
                        <Route path="/pv" element={<Pv />} />
                        <Route path="/historique" element={<Historique />} />
                        {/* On ajoutera les autres routes ici */}
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                      </Routes>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;