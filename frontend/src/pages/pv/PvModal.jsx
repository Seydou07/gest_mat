// pages/pv/PvModal.jsx
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
  FormHelperText,
  Button,
  Chip,
  Stack,
  Autocomplete
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const PvModal = ({ mode, initialData, agents, marches }) => {
  const [formData, setFormData] = useState({
    numero_marche: '',
    objet: '',
    date_reception: new Date().toISOString().split('T')[0],
    lieu: '',
    observations: '',
    agents_presents: [],
    fichier: null
  });

  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        numero_marche: initialData.numero_marche || '',
        objet: initialData.objet || '',
        date_reception: initialData.date_reception || new Date().toISOString().split('T')[0],
        lieu: initialData.lieu || '',
        observations: initialData.observations || '',
        agents_presents: initialData.agents_presents || [],
        fichier: initialData.fichier || null
      });
      setFileName(initialData.fichier_nom || '');
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setFormData(prev => ({ ...prev, fichier: file }));
      if (errors.fichier) {
        setErrors(prev => ({ ...prev, fichier: '' }));
      }
    }
  };

  const handleAgentsChange = (event, newValue) => {
    setFormData(prev => ({ ...prev, agents_presents: newValue }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.numero_marche) newErrors.numero_marche = 'Le numéro de marché est requis';
    if (!formData.objet) newErrors.objet = "L'objet est requis";
    if (!formData.date_reception) newErrors.date_reception = 'La date est requise';
    
    return newErrors;
  };

  const isReadOnly = mode === 'view';

  return (
    <Box>
      {/* Section 1 - Informations du marché */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WorkIcon sx={{ color: '#006400', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
            Informations du marché
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Numéro de marché *"
              name="numero_marche"
              value={formData.numero_marche}
              onChange={handleChange}
              error={!!errors.numero_marche}
              helperText={errors.numero_marche}
              disabled={isReadOnly}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Marché (optionnel)</InputLabel>
              <Select
                name="marche_id"
                value={formData.marche_id || ''}
                onChange={handleChange}
                label="Marché (optionnel)"
                disabled={isReadOnly}
              >
                <MenuItem value="">Sélectionner un marché</MenuItem>
                {marches && marches.map((m) => (
                  <MenuItem key={m.id} value={m.id}>{m.numero} - {m.objet}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Objet du marché *"
              name="objet"
              value={formData.objet}
              onChange={handleChange}
              error={!!errors.objet}
              helperText={errors.objet}
              disabled={isReadOnly}
              required
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Section 2 - Date et lieu */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EventIcon sx={{ color: '#006400', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
            Date et lieu de réception
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date de réception *"
              name="date_reception"
              type="date"
              value={formData.date_reception}
              onChange={handleChange}
              error={!!errors.date_reception}
              helperText={errors.date_reception}
              disabled={isReadOnly}
              required
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Lieu de réception"
              name="lieu"
              value={formData.lieu}
              onChange={handleChange}
              disabled={isReadOnly}
              size="small"
              placeholder="Ex: Magasin central, Site..."
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Section 3 - Agents présents */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PeopleIcon sx={{ color: '#006400', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
            Agents présents
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={agents || []}
              getOptionLabel={(option) => option ? `${option.nom} ${option.prenom} (${option.matricule})` : ''}
              value={formData.agents_presents || []}
              onChange={handleAgentsChange}
              disabled={isReadOnly}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={`${option.nom} ${option.prenom}`}
                    size="small"
                    {...getTagProps({ index })}
                    sx={{ bgcolor: '#e8f0fe', color: '#006400' }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sélectionner les agents présents"
                  placeholder="Agents"
                  size="small"
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Section 4 - Observations et fichier */}
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <DescriptionIcon sx={{ color: '#006400', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
            Observations et documents
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observations"
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              disabled={isReadOnly}
              size="small"
              multiline
              rows={3}
              placeholder="Observations éventuelles sur la réception..."
            />
          </Grid>
          
          {!isReadOnly && (
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                sx={{ mt: 1 }}
                fullWidth
              >
                {fileName ? 'Changer le fichier' : 'Importer le PV signé (PDF)'}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </Button>
              {fileName && (
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#006400' }}>
                  Fichier sélectionné : {fileName}
                </Typography>
              )}
            </Grid>
          )}
          
          {isReadOnly && formData.fichier && (
            <Grid item xs={12}>
              <Button
                variant="outlined"
                startIcon={<AttachFileIcon />}
                href={`http://localhost:3001/uploads/pv/${formData.fichier}`}
                target="_blank"
                sx={{ color: '#006400', borderColor: '#006400' }}
              >
                Voir le document
              </Button>
            </Grid>
          )}
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

export default PvModal;