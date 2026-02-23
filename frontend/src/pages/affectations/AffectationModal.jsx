// pages/affectations/AffectationModal.jsx
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
  Autocomplete
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PersonIcon from '@mui/icons-material/Person';
import ComputerIcon from '@mui/icons-material/Computer';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CommentIcon from '@mui/icons-material/Comment';

const AffectationModal = ({ mode, initialData, agents, materiels, projets }) => {
  const [formData, setFormData] = useState({
    agent_id: '',
    materiel_id: '',
    projet_id: '',
    date_affectation: new Date().toISOString().split('T')[0],
    date_retour: '',
    commentaire: '',
    statut: 'en_cours'
  });

  const [errors, setErrors] = useState({});
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedMateriel, setSelectedMateriel] = useState(null);

 useEffect(() => {
  if (initialData) {
    // Ajoute ces lignes ici
    console.log("1️⃣ initialData reçu:", initialData);
    console.log("2️⃣ projet_id:", initialData.projet_id);
    console.log("3️⃣ propriété projet?", initialData.projet);
    console.log("4️⃣ propriété Projet?", initialData.Projet);

    // À ajouter temporairement dans AffectationModal.jsx
useEffect(() => {
  const checkProjets = async () => {
    const affectations = await affectationService.getAll();
    console.log("🔍 Toutes les affectations avec projets:");
    affectations.forEach(aff => {
      console.log(`Affectation ID ${aff.id}:`, {
        projet_id: aff.projet_id,
        Projet: aff.Projet,
        projet: aff.projet
      });
    });
  };
  checkProjets();
}, []);
    
    setFormData({
      agent_id: initialData.agent_id || '',
      materiel_id: initialData.materiel_id || '',
      projet_id: initialData.projet_id || '',
      date_affectation: initialData.date_affectation || new Date().toISOString().split('T')[0],
      date_retour: initialData.date_retour || '',
      commentaire: initialData.commentaire || '',
      statut: initialData.statut || 'en_cours'
    });

    // Trouver l'agent et le matériel sélectionnés pour l'autocomplete
    if (initialData.agent_id && agents) {
      const agent = agents.find(a => a.id === initialData.agent_id);
      setSelectedAgent(agent || null);
    }
    if (initialData.materiel_id && materiels) {
      const materiel = materiels.find(m => m.id === initialData.materiel_id);
      setSelectedMateriel(materiel || null);
    }
  }
}, [initialData, agents, materiels]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAgentChange = (event, newValue) => {
    setSelectedAgent(newValue);
    setFormData(prev => ({ ...prev, agent_id: newValue?.id || '' }));
    if (errors.agent_id) {
      setErrors(prev => ({ ...prev, agent_id: '' }));
    }
  };

  const handleMaterielChange = (event, newValue) => {
    setSelectedMateriel(newValue);
    setFormData(prev => ({ ...prev, materiel_id: newValue?.id || '' }));
    if (errors.materiel_id) {
      setErrors(prev => ({ ...prev, materiel_id: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.agent_id) newErrors.agent_id = "L'agent est requis";
    if (!formData.materiel_id) newErrors.materiel_id = 'Le matériel est requis';
    if (!formData.date_affectation) newErrors.date_affectation = 'La date est requise';
    
    return newErrors;
  };

  const isReadOnly = mode === 'view';

  // Options de statut
  const statuts = [
    { value: 'en_cours', label: 'En cours', color: '#3b82f6' },
    { value: 'termine', label: 'Terminé', color: '#10b981' },
    { value: 'annule', label: 'Annulé', color: '#ef4444' }
  ];

  // Affichage "fiche" claire en mode view
  if (mode === 'view') {
    const agent = agents?.find(a => a.id === formData.agent_id);
    const materiel = materiels?.find(m => m.id === formData.materiel_id);
    const projet = projets?.find(p => p.id === formData.projet_id);
    const statutInfo = statuts.find(s => s.value === formData.statut);

    return (
      <Box sx={{ mt: 1 }}>
        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SwapHorizIcon sx={{ color: '#006400', mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
              Détails de l'affectation
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Agent
              </Typography>
              <Typography variant="body1">
                {agent ? `${agent.nom} ${agent.prenom} (${agent.matricule})` : '—'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Matériel
              </Typography>
              <Typography variant="body1">
                {materiel ? `${materiel.libelle} (${materiel.numero_serie})` : '—'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Projet
              </Typography>
              <Typography variant="body1">
                {projet ? projet.nom : 'Aucun projet'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <DateRangeIcon sx={{ color: '#006400', mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
              Période
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Date d'affectation
              </Typography>
              <Typography variant="body1">
                {formData.date_affectation || '—'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Date de retour
              </Typography>
              <Typography variant="body1">
                {formData.date_retour || '—'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CommentIcon sx={{ color: '#006400', mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
              Informations complémentaires
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Statut
              </Typography>
              <Typography variant="body1">
                {statutInfo ? statutInfo.label : '—'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Commentaire
              </Typography>
              <Typography variant="body1">
                {formData.commentaire || '—'}
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
      {/* Section 1 - Agent et Matériel */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SwapHorizIcon sx={{ color: '#006400', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
            Affectation
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        {/* Champs cachés pour FormData */}
        <input type="hidden" name="agent_id" value={formData.agent_id || ''} />
        <input type="hidden" name="materiel_id" value={formData.materiel_id || ''} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Autocomplete
              freeSolo
              clearOnBlur
              options={agents || []}
              getOptionLabel={(option) => {
                if (typeof option === 'string') return option;
                return option ? `${option.nom} ${option.prenom} (${option.matricule})` : '';
              }}
              renderOption={(props, option) => {
                const { key, ...otherProps } = props;
                return (
                  <Box component="li" key={key} {...otherProps} sx={{ py: 1, px: 2 }}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
                        {option.nom} {option.prenom}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                        Matricule: {option.matricule}
                      </Typography>
                    </Box>
                  </Box>
                );
              }}
              value={selectedAgent}
              onChange={(event, newValue) => {
                // Ne s'implémente que quand l'utilisateur sélectionne explicitement
                if (typeof newValue === 'object' && newValue) {
                  setSelectedAgent(newValue);
                  setFormData(prev => ({ ...prev, agent_id: newValue.id }));
                  if (errors.agent_id) {
                    setErrors(prev => ({ ...prev, agent_id: '' }));
                  }
                }
              }}
              disabled={isReadOnly}
              filterOptions={(options, state) => {
                // Recherche progressive seulement
                if (!state.inputValue) return options;
                return options.filter(option => 
                  `${option.nom} ${option.prenom}`.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                  option.matricule.toLowerCase().includes(state.inputValue.toLowerCase())
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Agent *"
                  placeholder="Rechercher un agent..."
                  error={!!errors.agent_id}
                  helperText={errors.agent_id}
                  size="small"
                  required
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              freeSolo
              clearOnBlur
              options={materiels || []}
              getOptionLabel={(option) => {
                if (typeof option === 'string') return option;
                return option ? `${option.libelle} (${option.numero_serie})` : '';
              }}
              renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ py: 1, px: 2 }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
                      {option.libelle}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                      N° Série: {option.numero_serie}
                    </Typography>
                  </Box>
                </Box>
              )}
              value={selectedMateriel}
              onChange={(event, newValue) => {
                // Ne s'implémente que quand l'utilisateur sélectionne explicitement
                if (typeof newValue === 'object' && newValue) {
                  setSelectedMateriel(newValue);
                  setFormData(prev => ({ ...prev, materiel_id: newValue.id }));
                  if (errors.materiel_id) {
                    setErrors(prev => ({ ...prev, materiel_id: '' }));
                  }
                }
              }}
              disabled={isReadOnly}
              filterOptions={(options, state) => {
                // Recherche progressive seulement
                if (!state.inputValue) return options;
                return options.filter(option => 
                  option.libelle.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                  option.numero_serie.toLowerCase().includes(state.inputValue.toLowerCase())
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Matériel *"
                  placeholder="Rechercher un matériel..."
                  error={!!errors.materiel_id}
                  helperText={errors.materiel_id}
                  size="small"
                  required
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Section 2 - Projet */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PersonIcon sx={{ color: '#006400', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
            Projet concerné
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              freeSolo
              clearOnBlur
              options={projets || []}
              getOptionLabel={(option) => {
                if (typeof option === 'string') return option;
                return option ? option.nom : '';
              }}
              renderOption={(props, option) => {
                const { key, ...otherProps } = props;
                return (
                  <Box component="li" key={key} {...otherProps} sx={{ py: 1, px: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
                      {option.nom}
                    </Typography>
                  </Box>
                );
              }}
              value={projets?.find(p => p.id === formData.projet_id) || null}
              onChange={(event, newValue) => {
                if (typeof newValue === 'object' && newValue) {
                  setFormData(prev => ({ ...prev, projet_id: newValue.id }));
                } else if (newValue === null) {
                  setFormData(prev => ({ ...prev, projet_id: '' }));
                }
              }}
              disabled={isReadOnly}
              filterOptions={(options, state) => {
                // Recherche progressive seulement
                if (!state.inputValue) return options;
                return options.filter(option => 
                  option.nom.toLowerCase().includes(state.inputValue.toLowerCase())
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Projet"
                  placeholder="Rechercher un projet..."
                  size="small"
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Section 3 - Dates */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <DateRangeIcon sx={{ color: '#006400', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
            Période d'affectation
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date d'affectation *"
              name="date_affectation"
              type="date"
              value={formData.date_affectation}
              onChange={handleChange}
              error={!!errors.date_affectation}
              helperText={errors.date_affectation}
              disabled={isReadOnly}
              required
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date de retour"
              name="date_retour"
              type="date"
              value={formData.date_retour}
              onChange={handleChange}
              disabled={isReadOnly}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Section 4 - Commentaire et statut */}
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CommentIcon sx={{ color: '#006400', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
            Informations complémentaires
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
                  <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Commentaire"
              name="commentaire"
              value={formData.commentaire}
              onChange={handleChange}
              disabled={isReadOnly}
              size="small"
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </Paper>

      {mode === 'view' && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          Fiche en lecture seule
        </Typography>
      )}
    </Box>
  );
};

export default AffectationModal;