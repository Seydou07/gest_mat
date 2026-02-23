// pages/projets/ProjetModal.jsx
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
import AssignmentIcon from '@mui/icons-material/Assignment';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const ProjetModal = ({ mode, initialData }) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    date_debut: '',
    date_fin: '',
    statut: 'en_cours',
    budget: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nom: initialData.nom || '',
        description: initialData.description || '',
        date_debut: initialData.date_debut || '',
        date_fin: initialData.date_fin || '',
        statut: initialData.statut || 'en_cours',
        budget: initialData.budget || ''
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
    if (!formData.nom) newErrors.nom = 'Le nom du projet est requis';
    if (!formData.date_debut) newErrors.date_debut = 'La date de début est requise';
    if (!formData.date_fin) newErrors.date_fin = 'La date de fin est requise';
    
    // Vérifier que la date de fin est après la date de début
    if (formData.date_debut && formData.date_fin && formData.date_fin < formData.date_debut) {
      newErrors.date_fin = 'La date de fin doit être après la date de début';
    }

    return newErrors;
  };

  const isReadOnly = mode === 'view';

  // Options de statut
  const statuts = [
    { value: 'en_cours', label: 'En cours', color: '#3b82f6' },
    { value: 'termine', label: 'Terminé', color: '#10b981' },
    { value: 'suspendu', label: 'Suspendu', color: '#f59e0b' },
    { value: 'annule', label: 'Annulé', color: '#ef4444' }
  ];

  // Fonction pour obtenir la couleur et le label du statut
  const getStatutInfo = (statut) => {
    const statutInfo = statuts.find(s => s.value === statut);
    return statutInfo || { label: statut || '—', color: '#999' };
  };

  // Affichage "fiche" claire en mode view
  if (mode === 'view') {
    const statutInfo = getStatutInfo(formData.statut);
    
    return (
      <Box sx={{ mt: 1 }}>
        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AssignmentIcon sx={{ color: '#006400', mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
              Informations générales
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {formData.nom || '—'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {formData.description || 'Aucune description'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Statut
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={statutInfo.label}
                  size="small"
                  sx={{
                    bgcolor: `${statutInfo.color}20`,
                    color: statutInfo.color,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    height: 24
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Budget
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formData.budget ? `${parseFloat(formData.budget).toLocaleString('fr-FR')} FCFA` : '—'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <DateRangeIcon sx={{ color: '#006400', mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
              Période du projet
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Date de début
              </Typography>
              <Typography variant="body1">
                {formData.date_debut ? new Date(formData.date_debut).toLocaleDateString('fr-FR') : '—'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Date de fin
              </Typography>
              <Typography variant="body1">
                {formData.date_fin ? new Date(formData.date_fin).toLocaleDateString('fr-FR') : '—'}
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
          <AssignmentIcon sx={{ color: '#006400', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
            Informations générales
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nom du projet *"
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
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isReadOnly}
              size="small"
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Section 2 - Dates */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <DateRangeIcon sx={{ color: '#006400', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
            Période du projet
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date de début *"
              name="date_debut"
              type="date"
              value={formData.date_debut}
              onChange={handleChange}
              error={!!errors.date_debut}
              helperText={errors.date_debut}
              disabled={isReadOnly}
              required
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date de fin *"
              name="date_fin"
              type="date"
              value={formData.date_fin}
              onChange={handleChange}
              error={!!errors.date_fin}
              helperText={errors.date_fin}
              disabled={isReadOnly}
              required
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Section 3 - Statut et budget */}
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AttachMoneyIcon sx={{ color: '#006400', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
            Informations financières
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
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
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Budget (FCFA)"
              name="budget"
              type="number"
              value={formData.budget}
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

export default ProjetModal;