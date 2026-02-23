// pages/auth/index.jsx
import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';

import sonabelLogo from '../../assets/sonabel.png';

// pages/auth/index.jsx
const Auth = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setError(data.message || "Nom d'utilisateur ou mot de passe incorrect.");
      }
    } catch (err) {
      console.error('Erreur login:', err);
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  // ... reste du code


  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Paper 
          elevation={6} 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 4,
            borderRadius: 3,
            width: '100%'
          }}
        >
          <Box sx={{ mb: 3 }}>
            <img 
              src={sonabelLogo} 
              alt="Logo SONABEL" 
              style={{ width: '150px', height: 'auto' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          </Box>
          
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', color: '#006400', mb: 1 }}>
            Gestion du Matériel
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Veuillez vous connecter pour accéder à l'application
          </Typography>

          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle sx={{ color: '#006400' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
              placeholder="admin"
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#006400' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
              placeholder="admin"
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                bgcolor: '#006400',
                '&:hover': { bgcolor: '#005000' },
                '&.Mui-disabled': { bgcolor: '#cccccc' },
                borderRadius: 2,
                fontWeight: 600,
                position: 'relative'
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Se connecter'
              )}
            </Button>
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
              Identifiants de démonstration : admin / admin
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Auth;