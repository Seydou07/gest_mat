// pages/magasins/MagasinModal.jsx
// Ce modal gère les Localisations (le backend n'a pas de modèle Magasin)
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Divider,
  Typography,
  Grid,
  Paper
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';

const MagasinModal = ({ mode, initialData }) => {
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    ville: '',
    pays: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nom: initialData.nom || '',
        adresse: initialData.adresse || '',
        ville: initialData.ville || '',
        pays: initialData.pays || '',
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const isReadOnly = mode === 'view';

  // Affichage "fiche" claire en mode view
  if (mode === 'view') {
    return (
      <Box sx={{ mt: 1 }}>
        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOnIcon sx={{ color: '#006400', mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
              Informations de la localisation
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {formData.nom}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Adresse
              </Typography>
              <Typography variant="body1">
                {formData.adresse || '—'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Ville
              </Typography>
              <Typography variant="body1">
                {formData.ville || '—'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Pays
              </Typography>
              <Typography variant="body1">
                {formData.pays || '—'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <DescriptionIcon sx={{ color: '#006400', mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
              Description
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1">
                {formData.description || '—'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          Fiche en lecture seule
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Section 1 - Informations principales */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationOnIcon sx={{ color: '#006400', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
            Informations de la localisation
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nom *"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              error={!!errors.nom}
              helperText={errors.nom}
              disabled={isReadOnly}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              disabled={isReadOnly}
              size="small"
              placeholder="Rue, numéro..."
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Ville"
              name="ville"
              value={formData.ville}
              onChange={handleChange}
              disabled={isReadOnly}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Pays"
              name="pays"
              value={formData.pays}
              onChange={handleChange}
              disabled={isReadOnly}
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Section 2 - Description */}
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <DescriptionIcon sx={{ color: '#006400', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
            Description
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isReadOnly}
              size="small"
              multiline
              rows={5}
              placeholder="Description de la localisation..."
            />
          </Grid>
        </Grid>
      </Paper>

      {mode === 'view' && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          Mode consultation - Les informations ne peuvent pas être modifiées
        </Typography>
      )}
    </Box>
  );
};

export default MagasinModal;