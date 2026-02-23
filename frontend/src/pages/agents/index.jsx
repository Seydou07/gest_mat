// pages/agents/index.jsx
import React, { useState, useEffect } from 'react';
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
  Stack
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
import AgentModal from './AgentModal';
import agentService from '../../services/agentService';
import api from '../../services/api';  // ← Ajouté pour les fonctions

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [fonctions, setFonctions] = useState([]);  // ← Pour l'autocomplete
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadAgents = async () => {
    setLoading(true);
    try {
      const data = await agentService.getAll();
      setAgents(data);
      setFilteredAgents(data);
    } catch (error) {
      showSnackbar('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadFonctions = async () => {
    try {
      // Récupérer toutes les fonctions pour l'autocomplete
      const response = await api.get('/config/fonctions');
      setFonctions(response.data);
    } catch (error) {
      console.error('Erreur chargement fonctions:', error);
    }
  };

  useEffect(() => {
    loadAgents();
    loadFonctions();  // ← Ajouté ici
  }, []);

  // Recherche
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAgents(agents);
    } else {
      const filtered = agents.filter(agent => 
        agent.matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.telephone?.includes(searchTerm) ||
        agent.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAgents(filtered);
      setPage(0);
    }
  }, [searchTerm, agents]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenModal = (mode, agent = null) => {
    setModalMode(mode);
    setSelectedAgent(agent);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAgent(null);
  };

  const handleSubmit = async (formData) => {
    try {
      // S'assurer que fonction est bien une string (FormData peut envoyer autre chose)
      const dataToSend = {
        ...formData,
        fonction: formData.fonction || ''
      };
      
      if (modalMode === 'add') {
        await agentService.create(dataToSend);
        showSnackbar('Agent ajouté avec succès');
      } else if (modalMode === 'edit') {
        await agentService.update(selectedAgent.id, dataToSend);
        showSnackbar('Agent modifié avec succès');
      }
      handleCloseModal();
      loadAgents();
      loadFonctions();  // ← Recharger les fonctions au cas où une nouvelle a été créée
    } catch (error) {
      console.error('Erreur soumission:', error);
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue';
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleDelete = async (id) => {
    setConfirmDelete({ open: true, id });
  };

  // Gestion pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Colonnes
  const columns = [
    { 
      field: 'matricule', 
      headerName: 'Matricule', 
      width: 120,
      sortable: false,
      disableColumnMenu: true
    },
    { 
      field: 'nom', 
      headerName: 'Nom', 
      width: 150,
      sortable: false,
      disableColumnMenu: true
    },
    { 
      field: 'prenom', 
      headerName: 'Prénom', 
      width: 150,
      sortable: false,
      disableColumnMenu: true
    },
    { 
      field: 'fonction',
      headerName: 'Fonction', 
      width: 180,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        // Priorité au champ formaté par le backend, puis à l'inclusion Sequelize
        const fromString = params?.row?.fonction;
        if (fromString) return fromString;
        const fromInclude = params?.row?.Fonction?.nom;
        return fromInclude || '—';
      }
    },
    { 
      field: 'telephone', 
      headerName: 'Téléphone', 
      width: 130,
      sortable: false,
      disableColumnMenu: true
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 200,
      sortable: false,
      disableColumnMenu: true
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
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
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
        Gestion des Agents
      </Typography>

      {/* En-tête avec recherche à gauche et bouton à droite */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Rechercher un agent..."
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
          Nouvel agent
        </Button>
      </Box>

      {/* Tableau */}
      <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <DataGrid
          rows={filteredAgents}
          columns={columns}
          rowCount={filteredAgents.length}
          loading={loading}
          disableSelectionOnClick
          disableColumnMenu={true}
          disableColumnFilter={true}
          disableColumnSelector={true}
          disableDensitySelector={true}
          hideFooter={true}
          getRowId={(row) => row.id}
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
        
        {/* Pagination */}
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
            count={filteredAgents.length}
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

      {/* Modal */}
      <FormModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          modalMode === 'add' ? 'Ajouter un agent' :
          modalMode === 'edit' ? 'Modifier un agent' :
          'Détails de l\'agent'
        }
        onSubmit={modalMode !== 'view' ? handleSubmit : null}
        submitText={modalMode === 'add' ? 'Ajouter' : modalMode === 'edit' ? 'Modifier' : ''}
        maxWidth="sm"
      >
        <AgentModal
          mode={modalMode}
          initialData={selectedAgent}
          fonctions={fonctions}  // ← Passage des fonctions au modal
        />
      </FormModal>

      <ConfirmDialog
        open={confirmDelete.open}
        title="Confirmation de suppression"
        message="Voulez-vous vraiment supprimer cet agent ?"
        confirmText="Oui"
        cancelText="Non"
        onConfirm={async () => {
          try {
            await agentService.delete(confirmDelete.id);
            showSnackbar('Agent supprimé avec succès');
            loadAgents();
          } catch (error) {
            showSnackbar('Erreur lors de la suppression', 'error');
          } finally {
            setConfirmDelete({ open: false, id: null });
          }
        }}
        onCancel={() => setConfirmDelete({ open: false, id: null })}
      />

      {/* Snackbar */}
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

export default AgentsPage;
