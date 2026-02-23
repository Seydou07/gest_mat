// pages/affectations/index.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  InputAdornment,
  TextField,
  TablePagination,
  Stack,
  Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { frFR } from '@mui/x-data-grid/locales';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon
} from '@mui/icons-material';

import FormModal from '../../components/Modals/FormModal';
import ConfirmDialog from '../../components/Modals/ConfirmDialog';
import AffectationModal from './AffectationModal';
import affectationService from '../../services/affectationService';

const AffectationsPage = () => {
  const [affectations, setAffectations] = useState([]);
  const [filteredAffectations, setFilteredAffectations] = useState([]);
  const [agents, setAgents] = useState([]);
  const [materiels, setMateriels] = useState([]);
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAffectation, setSelectedAffectation] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Récupérer les affectations ET les données séparées pour les autocomplete
      const [affectationsData, agentsData, materielsData, projetsData] = await Promise.all([
        affectationService.getAll(),
        affectationService.getAgents(),
        affectationService.getMateriels(),
        affectationService.getProjets()
      ]);
      
      console.log('Affectations reçues:', affectationsData); // Debug
      console.log('Structure première affectation:', JSON.stringify(affectationsData[0], null, 2)); // Debug structure détaillée
      console.log('Agents reçus:', agentsData); // Debug
      console.log('Matériels reçus:', materielsData); // Debug
      console.log('Projets reçus:', projetsData); // Debug
      
      setAffectations(affectationsData);
      setFilteredAffectations(affectationsData);
      setAgents(agentsData);
      setMateriels(materielsData);
      setProjets(projetsData);
      
    } catch (error) {
      console.error('Erreur chargement données:', error);
      showSnackbar('Erreur lors du chargement', 'error');
      
      // Données de démonstration si le backend n'est pas disponible
      const demoAgents = [
        { id: 1, nom: 'Dupont', prenom: 'Jean', matricule: 'AG001' },
        { id: 2, nom: 'Martin', prenom: 'Marie', matricule: 'AG002' },
        { id: 3, nom: 'Bernard', prenom: 'Pierre', matricule: 'AG003' }
      ];
      
      const demoMateriels = [
        { id: 1, libelle: 'Ordinateur Portable', numero_serie: 'LP001' },
        { id: 2, libelle: 'Imprimante HP', numero_serie: 'HP002' },
        { id: 3, libelle: 'Serveur Dell', numero_serie: 'SV003' }
      ];
      
      const demoProjets = [
        { id: 1, nom: 'Projet Alpha' },
        { id: 2, nom: 'Projet Beta' }
      ];
      
      const demoAffectations = [
        {
          id: 1,
          materiel_id: 1,
          agent_id: 1,
          projet_id: 1,
          date_affectation: '2024-01-15',
          statut: 'en_cours',
          Materiel: { id: 1, libelle: 'Ordinateur Portable', numero_serie: 'LP001' },
          Agent: { id: 1, nom: 'Dupont', prenom: 'Jean', matricule: 'AG001' },
          Projet: { id: 1, nom: 'Projet Alpha' }
        },
        {
          id: 2,
          materiel_id: 2,
          agent_id: 2,
          projet_id: 2,
          date_affectation: '2024-01-20',
          statut: 'termine',
          Materiel: { id: 2, libelle: 'Imprimante HP', numero_serie: 'HP002' },
          Agent: { id: 2, nom: 'Martin', prenom: 'Marie', matricule: 'AG002' },
          Projet: { id: 2, nom: 'Projet Beta' }
        }
      ];
      
      setAffectations(demoAffectations);
      setFilteredAffectations(demoAffectations);
      setAgents(demoAgents);
      setMateriels(demoMateriels);
      setProjets(demoProjets);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAffectations(affectations);
    } else {
      const filtered = affectations.filter(a => {
        const agent = agents.find(ag => ag.id === a.agent_id);
        const materiel = materiels.find(m => m.id === a.materiel_id);
        return (
          agent?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agent?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agent?.matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          materiel?.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          materiel?.numero_serie?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setFilteredAffectations(filtered);
      setPage(0);
    }
  }, [searchTerm, affectations, agents, materiels]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenModal = (mode, affectation = null) => {
    setModalMode(mode);
    setSelectedAffectation(affectation);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAffectation(null);
  };

  const handleSubmit = async (formData) => {
    try {
      console.log('Soumission des données:', formData); // Debug
      if (modalMode === 'add') {
        await affectationService.create(formData);
        showSnackbar('Affectation créée avec succès');
      } else if (modalMode === 'edit') {
        await affectationService.update(selectedAffectation.id, formData);
        showSnackbar('Affectation modifiée avec succès');
      }
      handleCloseModal();
      loadAllData();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error); // Debug
      const errorMessage = error.response?.data?.message || error.message || 'Une erreur est survenue';
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleDelete = (id) => {
    setConfirmDelete({ open: true, id });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatutLabel = (statut) => {
    switch (statut) {
      case 'en_cours': return 'En cours';
      case 'termine': return 'Terminé';
      case 'annule': return 'Annulé';
      default: return statut;
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'en_cours': return '#3b82f6';
      case 'termine': return '#10b981';
      case 'annule': return '#ef4444';
      default: return '#999';
    }
  };

  const columns = useMemo(() => [
    {
      field: 'Materiel',
      headerName: 'Matériel',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (value, row) => {
        if (!row) return '—';
        // Utiliser les données incluses du backend
        if (row.Materiel) {
          return `${row.Materiel.libelle} (${row.Materiel.numero_serie})`;
        }
        // Fallback comme pour les agents
        const materiel = materiels.find(m => m.id === row.materiel_id);
        return materiel ? `${materiel.libelle} (${materiel.numero_serie})` : '—';
      }
    },
    {
      field: 'Agent',
      headerName: 'Agent',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (value, row) => {
        if (!row) return '—';
        // Utiliser les données incluses du backend
        if (row.Agent) {
          return `${row.Agent.nom} ${row.Agent.prenom}`;
        }
        // Fallback pour les données de démonstration
        const agent = agents.find(a => a.id === row.agent_id);
        return agent ? `${agent.nom} ${agent.prenom}` : '—';
      }
    },
    {
      field: 'Projet',
      headerName: 'Projet',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const row = params.row;
        if (!row) return '—';
        
        // 1. Essayer les données incluses (Projet ou projet)
        const projetData = row.Projet || row.projet;
        if (projetData && projetData.nom) {
          return projetData.nom;
        }
        
        // 2. Fallback avec recherche dans la liste des projets chargée séparément
        // On vérifie projet_id ET id_projet au cas où
        const pId = row.projet_id || row.id_projet;
        if (pId && projets && projets.length > 0) {
          const p = projets.find(item => item.id === pId);
          if (p) return p.nom;
        }
        
        return '—';
      }
    },
    {
      field: 'date_affectation',
      headerName: 'Date',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (value, row) => {
        if (!row || !row.date_affectation) return '—';
        return new Date(row.date_affectation).toLocaleDateString('fr-FR');
      }
    },
    {
      field: 'statut',
      headerName: 'Statut',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const color = getStatutColor(params.value);
        return (
          <Chip
            label={getStatutLabel(params.value)}
            size="small"
            sx={{
              bgcolor: `${color}20`,
              color: color,
              fontWeight: 500,
              fontSize: '0.75rem',
              height: 24
            }}
          />
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} justifyContent="center">
          <Tooltip title="Voir détails">
            <IconButton color="info" size="small" onClick={() => handleOpenModal('view', params.row)}>
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Modifier">
            <IconButton color="primary" size="small" onClick={() => handleOpenModal('edit', params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Supprimer">
            <IconButton color="error" size="small" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ], [materiels, agents, projets]);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
        Gestion des Affectations
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Rechercher une affectation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#999' }} />
              </InputAdornment>
            ),
            sx: { borderRadius: 2, width: 300 }
          }}
          size="small"
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal('add')}
          sx={{ bgcolor: '#006400', '&:hover': { bgcolor: '#005000' } }}
        >
          Nouvelle affectation
        </Button>
      </Box>

      <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <DataGrid
          rows={filteredAffectations}
          columns={columns}
          rowCount={filteredAffectations.length}
          loading={loading}
          disableSelectionOnClick
          disableColumnMenu={true}
          disableColumnFilter={true}
          disableColumnSelector={true}
          disableDensitySelector={true}
          hideFooter={true}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: '#f8f9fa',
              borderBottom: '2px solid #e0e0e0',
              minHeight: '48px !important'
            },
            '& .MuiDataGrid-columnHeader': {
              '&:focus': { outline: 'none' },
              '&:focus-within': { outline: 'none' }
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0',
              '&:focus': { outline: 'none' }
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: '#f5f5f5'
            }
          }}
          autoHeight
        />

        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          p: 2,
          borderTop: '1px solid #e0e0e0',
          bgcolor: '#f8f9fa'
        }}>
          <TablePagination
            component="div"
            count={filteredAffectations.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage=""
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
            sx={{
              '& .MuiTablePagination-select': { borderRadius: 1 },
              '& .MuiTablePagination-selectLabel': { display: 'none' },
              '& .MuiTablePagination-displayedRows': { mb: 0 }
            }}
          />
        </Box>
      </Paper>

      <FormModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          modalMode === 'add' ? 'Nouvelle affectation' :
            modalMode === 'edit' ? 'Modifier l\'affectation' :
              'Détails de l\'affectation'
        }
        onSubmit={modalMode !== 'view' ? handleSubmit : null}
        submitText={modalMode === 'add' ? 'Créer' : modalMode === 'edit' ? 'Modifier' : ''}
        maxWidth="sm"
      >
        <AffectationModal
          mode={modalMode}
          initialData={selectedAffectation}
          agents={agents}
          materiels={materiels}
          projets={projets}
        />
      </FormModal>

      <ConfirmDialog
        open={confirmDelete.open}
        title="Confirmation de suppression"
        message="Voulez-vous vraiment supprimer cette affectation ?"
        confirmText="Oui"
        cancelText="Non"
        onConfirm={async () => {
          try {
            await affectationService.delete(confirmDelete.id);
            showSnackbar('Affectation supprimée avec succès');
            loadAllData();
          } catch (error) {
            showSnackbar('Erreur lors de la suppression', 'error');
          } finally {
            setConfirmDelete({ open: false, id: null });
          }
        }}
        onCancel={() => setConfirmDelete({ open: false, id: null })}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AffectationsPage;