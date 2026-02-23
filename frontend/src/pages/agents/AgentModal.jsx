// pages/agents/AgentModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Divider,
  Typography,
  Grid,
  Paper,
  Autocomplete
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import WorkIcon from '@mui/icons-material/Work';

const AgentModal = ({ mode, initialData, fonctions = [] }) => {
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    date_naissance: '',
    telephone: '',
    email: '',
    fonction: ''  // La valeur saisie ou sélectionnée
  });

  const [errors, setErrors] = useState({});
  const [selectedFonction, setSelectedFonction] = useState(null);

  useEffect(() => {
    if (initialData) {
      // Si on a une fonction_id, trouver la fonction correspondante
      let fonctionValue = '';
      let fonctionObj = null;
      
      if (initialData.fonction_id && fonctions.length > 0) {
        fonctionObj = fonctions.find(f => f.id === initialData.fonction_id);
        fonctionValue = fonctionObj ? fonctionObj.nom : '';
      } else if (initialData.fonction) {
        // Pour le mode view, on peut avoir directement le nom
        fonctionValue = initialData.fonction;
      }

      setFormData({
        matricule: initialData.matricule || '',
        nom: initialData.nom || '',
        prenom: initialData.prenom || '',
        date_naissance: initialData.date_naissance || '',
        telephone: initialData.telephone || '',
        email: initialData.email || '',
        fonction: fonctionValue
      });
      setSelectedFonction(fonctionObj);
    }
  }, [initialData, fonctions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFonctionChange = (event, newValue) => {
    // newValue peut être :
    // - un objet { id, nom } si sélectionné depuis la liste
    // - une chaîne si tapé manuellement
    // - null si effacé
    
    if (typeof newValue === 'string') {
      // L'utilisateur a tapé un texte libre
      setFormData(prev => ({ ...prev, fonction: newValue }));
      setSelectedFonction(null);
    } else if (newValue && newValue.nom) {
      // L'utilisateur a sélectionné une fonction existante
      setFormData(prev => ({ ...prev, fonction: newValue.nom }));
      setSelectedFonction(newValue);
    } else {
      // Champ vidé
      setFormData(prev => ({ ...prev, fonction: '' }));
      setSelectedFonction(null);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.matricule) newErrors.matricule = 'Le matricule est requis';
    if (!formData.nom) newErrors.nom = 'Le nom est requis';
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    return newErrors;
  };

  const isReadOnly = mode === 'view';

  // Affichage "fiche" claire en mode view
  if (mode === 'view') {
    return (
      <Box sx={{ mt: 1 }}>
        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PersonIcon sx={{ color: '#006400', mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
              Identité de l'agent
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {formData.nom} {formData.prenom}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Matricule : <b>{formData.matricule || '—'}</b>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Date de naissance
              </Typography>
              <Typography variant="body1">
                {formData.date_naissance || '—'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Fonction
              </Typography>
              <Typography variant="body1">
                {formData.fonction || '—'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ContactPhoneIcon sx={{ color: '#006400', mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
              Coordonnées
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Téléphone
              </Typography>
              <Typography variant="body1">
                {formData.telephone || '—'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">
                {formData.email || '—'}
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
      {/* Section 1 - Identité */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PersonIcon sx={{ color: '#006400', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
            Informations personnelles
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Matricule *"
              name="matricule"
              value={formData.matricule}
              onChange={handleChange}
              error={!!errors.matricule}
              helperText={errors.matricule}
              required
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nom *"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              error={!!errors.nom}
              helperText={errors.nom}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Prénom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date de naissance"
              name="date_naissance"
              type="date"
              value={formData.date_naissance}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Section 2 - Contact */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ContactPhoneIcon sx={{ color: '#006400', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
            Coordonnées
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Téléphone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Section 3 - Professionnel avec AUTOCOMPLETE */}
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WorkIcon sx={{ color: '#006400', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#006400' }}>
            Informations professionnelles
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {/* Champ caché pour que FormData récupère la valeur de la fonction */}
            <input type="hidden" name="fonction" value={formData.fonction || ''} />
            <Autocomplete
              freeSolo  // Permet de saisir du texte libre
              options={fonctions}
              getOptionLabel={(option) => {
                // option peut être un objet ou une chaîne
                if (typeof option === 'string') return option;
                return option.nom || '';
              }}
              value={formData.fonction}
              onChange={handleFonctionChange}
              onInputChange={(event, newInputValue) => {
                // Met à jour le champ quand l'utilisateur tape
                setFormData(prev => ({ ...prev, fonction: newInputValue }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Fonction"
                  placeholder="Tapez ou sélectionnez une fonction"
                  size="small"
                  fullWidth
                />
              )}
              renderOption={(props, option) => {
                const { key, ...otherProps } = props;
                return (
                  <li key={key} {...otherProps}>
                    {option.nom}
                  </li>
                );
              }}
              filterOptions={(options, { inputValue }) => {
                // Filtrer les options en fonction de ce que l'utilisateur tape
                const filtered = options.filter(opt => 
                  opt.nom.toLowerCase().includes(inputValue.toLowerCase())
                );
                return filtered;
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AgentModal;