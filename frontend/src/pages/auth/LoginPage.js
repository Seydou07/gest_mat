// src/pages/auth/LoginPage.js

import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  InputAdornment,
  Alert // On importe le composant Alert
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';

import sonabelLogo from '../../assets/sonabel.png'; 

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Pour gérer le message d'erreur

  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); // On réinitialise l'erreur à chaque tentative

    // --- LOGIQUE DE CONNEXION FICTIVE ---
    if (username === 'admin' && password === 'admin') {
      console.log("Connexion réussie !");
      onLoginSuccess();
    } else {
      setError("Nom d'utilisateur ou mot de passe incorrect.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={6} 
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          borderRadius: 2,
        }}
      >
        <Box sx={{ mb: 2 }}>
          <img 
            src={sonabelLogo} 
            alt="Logo SONABEL" 
            style={{ width: '120px', height: 'auto' }}
          />
        </Box>
        <Typography component="h1" variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
          Gestion du Matériel
        </Typography>
        <Typography component="p" variant="body1" sx={{ mt: 1 }}>
          Veuillez vous connecter
        </Typography>

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nom d'utilisateur"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de passe"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            Se connecter
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}