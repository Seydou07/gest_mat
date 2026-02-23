// pages/marques/MarqueModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Divider,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import DescriptionIcon from '@mui/icons-material/Description';
import LanguageIcon from '@mui/icons-material/Language';
import LinkIcon from '@mui/icons-material/Link';

const MarqueModal = ({ mode, initialData }) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    site_web: '',
    pays_origine: '',
    statut: 'active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nom: initialData.nom || '',
        description: initialData.description || '',
        site_web: initialData.site_web || '',
        pays_origine: initialData.pays_origine || '',
        statut: initialData.statut || 'active'
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

  const validate = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = 'Le nom de la marque est requis';
    
    if (formData.site_web && !/^https?:\/\/.+/.test(formData.site_web)) {
      newErrors.site_web = 'URL invalide (doit commencer par http:// ou https://)';
    }

    return newErrors;
  };

  const isReadOnly = mode === 'view';

  const statuts = [
    { value: 'active', label: 'Active', color: '#10b981' },
    { value: 'inactive', label: 'Inactive', color: '#ef4444' }
  ];

  return (
    <Box>
      {/* Section 1 - Informations principales */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BrandingWatermarkIcon sx={{ color: '#006400', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
            Informations principales
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Nom de la marque *"
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
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Statut</InputLabel>
              <Select
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                label="Statut"
                disabled={isReadOnly}
              >
                {statuts.map((s) => (
                  <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Section 2 - Description */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
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
              rows={3}
              placeholder="Description de la marque..."
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Section 3 - Informations complémentaires */}
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LanguageIcon sx={{ color: '#006400', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
            Informations complémentaires
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Site web"
              name="site_web"
              value={formData.site_web}
              onChange={handleChange}
              error={!!errors.site_web}
              helperText={errors.site_web}
              disabled={isReadOnly}
              size="small"
              placeholder="https://www.example.com"
              InputProps={{
                startAdornment: <LinkIcon sx={{ color: '#999', mr: 1, fontSize: 18 }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Pays d'origine"
              name="pays_origine"
              value={formData.pays_origine}
              onChange={handleChange}
              disabled={isReadOnly}
              size="small"
              placeholder="Ex: France, Chine, USA..."
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

export default MarqueModal;