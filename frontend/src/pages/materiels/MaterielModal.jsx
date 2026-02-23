// pages/materiels/MaterielModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Divider,
  Typography,
  Grid,
  Paper,
  Chip
} from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import BuildIcon from '@mui/icons-material/Build';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const MaterielModal = ({ mode, initialData, types, etats, localisations, marques, projets }) => {
  const [formData, setFormData] = useState({
    libelle: '',
    numero_serie: '',
    type_id: '',
    etat_id: '',
    date_acquisition: '',
    valeur: '',
    localisation_id: '',
    id_projet: '',
    marque_id: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        libelle: initialData.libelle || '',
        numero_serie: initialData.numero_serie || '',
        type_id: initialData.type_id || '',
        etat_id: initialData.etat_id || '',
        date_acquisition: initialData.date_acquisition || '',
        valeur: initialData.valeur || '',
        localisation_id: initialData.localisation_id || '',
        id_projet: initialData.id_projet || '',
        marque_id: initialData.marque_id || '',
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

  const validate = () => {
    const newErrors = {};
    if (!formData.libelle) newErrors.libelle = 'Le libellé est requis';
    if (!formData.numero_serie) newErrors.numero_serie = 'Le numéro de série est requis';
    if (!formData.type_id) newErrors.type_id = 'Le type est requis';
    if (!formData.etat_id) newErrors.etat_id = "L'état est requis";
    if (!formData.localisation_id) newErrors.localisation_id = 'La localisation est requise';
    if (!formData.id_projet) newErrors.id_projet = 'Le projet est requis';
    
    return newErrors;
  };

  const isReadOnly = mode === 'view';

  // Fonctions pour obtenir les labels à partir des IDs
  const getTypeLabel = (typeId) => {
    const type = types?.find(t => t.id === typeId);
    return type ? type.nom : '—';
  };

  const getEtatLabel = (etatId) => {
    const etat = etats?.find(e => e.id === etatId);
    return etat ? etat.libelle : '—';
  };

  const getMarqueLabel = (marqueId) => {
    const marque = marques?.find(m => m.id === marqueId);
    return marque ? marque.nom : '—';
  };

  const getLocalisationLabel = (localisationId) => {
    const localisation = localisations?.find(l => l.id === localisationId);
    return localisation ? localisation.nom : '—';
  };

  const getProjetLabel = (projetId) => {
    const projet = projets?.find(p => p.id === projetId);
    return projet ? projet.nom : '—';
  };

  // Affichage "fiche" claire en mode view
  if (mode === 'view') {
    return (
      <Box sx={{ mt: 1 }}>
        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ComputerIcon sx={{ color: '#006400', mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
              Informations générales
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {formData.libelle || '—'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {formData.description || 'Aucune description'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Numéro de série
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formData.numero_serie || '—'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Marque
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {getMarqueLabel(formData.marque_id)}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CategoryIcon sx={{ color: '#006400', mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
              Classification
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Type
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {getTypeLabel(formData.type_id)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                État
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={getEtatLabel(formData.etat_id)}
                  size="small"
                  sx={{
                    bgcolor: '#f0f0f0',
                    color: '#666',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    height: 24
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOnIcon sx={{ color: '#006400', mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
              Localisation et projet
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Localisation
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {getLocalisationLabel(formData.localisation_id)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Projet assigné
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {getProjetLabel(formData.id_projet)}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EventIcon sx={{ color: '#006400', mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
              Informations d'acquisition
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Date d'acquisition
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formData.date_acquisition ? new Date(formData.date_acquisition).toLocaleDateString('fr-FR') : '—'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Valeur
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formData.valeur ? `${parseFloat(formData.valeur).toLocaleString('fr-FR')} FCFA` : '—'}
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

  // Mode ajout / édition (formulaire complet)
  return (
    <Box>
      {/* Section 1 - Informations générales */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ComputerIcon sx={{ color: '#006400', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
            Informations générales
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Libellé *"
              name="libelle"
              value={formData.libelle}
              onChange={handleChange}
              error={!!errors.libelle}
              helperText={errors.libelle}
              disabled={isReadOnly}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Numéro de série *"
              name="numero_serie"
              value={formData.numero_serie}
              onChange={handleChange}
              error={!!errors.numero_serie}
              helperText={errors.numero_serie}
              disabled={isReadOnly}
              required
              size="small"
            />
          </Grid>
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
              rows={2}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Section 2 - Classification */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CategoryIcon sx={{ color: '#006400', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
            Classification
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small" error={!!errors.type_id}>
              <InputLabel>Type *</InputLabel>
              <Select
                name="type_id"
                value={formData.type_id}
                onChange={handleChange}
                label="Type *"
                disabled={isReadOnly}
                required
              >
                <MenuItem value="">Sélectionnez un type</MenuItem>
                {types && types.map((t) => (
                  <MenuItem key={t.id} value={t.id}>{t.nom}</MenuItem>
                ))}
              </Select>
              {errors.type_id && <FormHelperText>{errors.type_id}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small" error={!!errors.etat_id}>
              <InputLabel>État *</InputLabel>
              <Select
                name="etat_id"
                value={formData.etat_id}
                onChange={handleChange}
                label="État *"
                disabled={isReadOnly}
                required
              >
                <MenuItem value="">Sélectionnez un état</MenuItem>
                {etats && etats.map((e) => (
                  <MenuItem key={e.id} value={e.id}>{e.libelle}</MenuItem>
                ))}
              </Select>
              {errors.etat_id && <FormHelperText>{errors.etat_id}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Marque</InputLabel>
              <Select
                name="marque_id"
                value={formData.marque_id}
                onChange={handleChange}
                label="Marque"
                disabled={isReadOnly}
              >
                <MenuItem value="">Sélectionnez une marque</MenuItem>
                {marques && marques.map((m) => (
                  <MenuItem key={m.id} value={m.id}>{m.nom}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Section 3 - Localisation et projet */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationOnIcon sx={{ color: '#006400', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
            Localisation et projet
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small" error={!!errors.localisation_id}>
              <InputLabel>Localisation *</InputLabel>
              <Select
                name="localisation_id"
                value={formData.localisation_id}
                onChange={handleChange}
                label="Localisation *"
                disabled={isReadOnly}
                required
              >
                <MenuItem value="">Sélectionnez une localisation</MenuItem>
                {localisations && localisations.map((l) => (
                  <MenuItem key={l.id} value={l.id}>{l.nom}</MenuItem>
                ))}
              </Select>
              {errors.localisation_id && <FormHelperText>{errors.localisation_id}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small" error={!!errors.id_projet}>
              <InputLabel>Projet *</InputLabel>
              <Select
                name="id_projet"
                value={formData.id_projet}
                onChange={handleChange}
                label="Projet *"
                disabled={isReadOnly}
                required
              >
                <MenuItem value="">Sélectionnez un projet</MenuItem>
                {projets && projets.map((p) => (
                  <MenuItem key={p.id} value={p.id}>{p.nom}</MenuItem>
                ))}
              </Select>
              {errors.id_projet && <FormHelperText>{errors.id_projet}</FormHelperText>}
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Section 4 - Acquisition */}
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EventIcon sx={{ color: '#006400', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
            Informations d'acquisition
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date d'acquisition"
              name="date_acquisition"
              type="date"
              value={formData.date_acquisition}
              onChange={handleChange}
              disabled={isReadOnly}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Valeur (FCFA)"
              name="valeur"
              type="number"
              value={formData.valeur}
              onChange={handleChange}
              disabled={isReadOnly}
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default MaterielModal;
