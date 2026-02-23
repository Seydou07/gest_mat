// pages/projets/index.jsx
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
import ProjetModal from './ProjetModal';
import projetService from '../../services/projetService';

const ProjetsPage = () => {
  const [projets, setProjets] = useState([]);
  const [filteredProjets, setFilteredProjets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProjet, setSelectedProjet] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadProjets = async () => {
    setLoading(true);
    try {
      const data = await projetService.getAll();
      console.log('Projets data reçue:', data); // Debug
      setProjets(data);
      setFilteredProjets(data);
    } catch (error) {
      console.error('Erreur projets:', error);
      showSnackbar('Erreur lors du chargement', 'error');
      // Données de démonstration si le backend n'est pas disponible
      const demoData = [
        {
          id: 1,
          nom: 'Projet Test 1',
          description: 'Description du projet test',
          statut: 'en_cours',
          date_debut: '2024-01-01',
          date_fin: '2024-12-31',
          budget: 5000000
        },
        {
          id: 2,
          nom: 'Projet Test 2',
          description: 'Autre projet test',
          statut: 'termine',
          date_debut: '2023-01-01',
          date_fin: '2023-06-30',
          budget: 2500000
        }
      ];
      setProjets(demoData);
      setFilteredProjets(demoData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjets();
  }, []);

  // Recherche
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProjets(projets);
    } else {
      const filtered = projets.filter(projet =>
        projet.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        projet.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        projet.statut?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjets(filtered);
      setPage(0);
    }
  }, [searchTerm, projets]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenModal = (mode, projet = null) => {
    setModalMode(mode);
    setSelectedProjet(projet);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProjet(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (modalMode === 'add') {
        await projetService.create(formData);
        showSnackbar('Projet ajouté avec succès');
      } else if (modalMode === 'edit') {
        await projetService.update(selectedProjet.id, formData);
        showSnackbar('Projet modifié avec succès');
      }
      handleCloseModal();
      loadProjets();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue';
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

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'en_cours': return '#3b82f6';
      case 'termine': return '#10b981';
      case 'suspendu': return '#f59e0b';
      case 'annule': return '#ef4444';
      default: return '#999';
    }
  };

  const getStatutLabel = (statut) => {
    switch (statut) {
      case 'en_cours': return 'En cours';
      case 'termine': return 'Terminé';
      case 'suspendu': return 'Suspendu';
      case 'annule': return 'Annulé';
      default: return statut || '—';
    }
  };

  const columns = [
    {
      field: 'nom',
      headerName: 'Nom du projet',
      width: 200,
      sortable: false,
      disableColumnMenu: true
    },
    {
      field: 'statut',
      headerName: 'Statut',
      width: 130,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const color = getStatutColor(params.row.statut);
        return (
          <Chip
            label={getStatutLabel(params.row.statut)}
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
      field: 'date_debut',
      headerName: 'Date début',
      width: 130,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const dateVal = params.row.date_debut || params.row.DateDebut;
        if (!dateVal) return '—';
        return new Date(dateVal).toLocaleDateString('fr-FR');
      }
    },
    {
      field: 'date_fin',
      headerName: 'Date fin',
      width: 130,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const dateVal = params.row.date_fin || params.row.DateFin;
        if (!dateVal) return '—';
        return new Date(dateVal).toLocaleDateString('fr-FR');
      }
    },
    {
      field: 'budget',
      headerName: 'Budget (FCFA)',
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        // Essayer budget (minuscule) et Budget (majuscule) au cas où
        const budgetValue = params.row?.budget ?? params.row?.Budget;
        if (budgetValue === null || budgetValue === undefined || budgetValue === '') return '—';
        const budget = parseFloat(budgetValue);
        if (isNaN(budget)) return '—';
        return `${budget.toLocaleString('fr-FR')} FCFA`;
      }
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
        Gestion des Projets
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Rechercher un projet..."
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
          Nouveau projet
        </Button>
      </Box>

      <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <DataGrid
          rows={filteredProjets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
          columns={columns}
          rowCount={filteredProjets.length}
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
            count={filteredProjets.length}
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
          modalMode === 'add' ? 'Ajouter un projet' :
            modalMode === 'edit' ? 'Modifier le projet' :
              'Détails du projet'
        }
        onSubmit={modalMode !== 'view' ? handleSubmit : null}
        submitText={modalMode === 'add' ? 'Ajouter' : modalMode === 'edit' ? 'Modifier' : ''}
        maxWidth="sm"
      >
        <ProjetModal
          mode={modalMode}
          initialData={selectedProjet}
        />
      </FormModal>

      <ConfirmDialog
        open={confirmDelete.open}
        title="Confirmation de suppression"
        message="Voulez-vous vraiment supprimer ce projet ?"
        confirmText="Oui"
        cancelText="Non"
        onConfirm={async () => {
          try {
            await projetService.delete(confirmDelete.id);
            showSnackbar('Projet supprimé avec succès');
            loadProjets();
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

export default ProjetsPage;