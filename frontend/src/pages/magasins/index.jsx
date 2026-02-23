// pages/magasins/index.jsx
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
import MagasinModal from './MagasinModal';
import magasinService from '../../services/magasinService';

const MagasinsPage = () => {
  const [magasins, setMagasins] = useState([]);
  const [filteredMagasins, setFilteredMagasins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMagasin, setSelectedMagasin] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadMagasins = async () => {
    setLoading(true);
    try {
      const response = await magasinService.getAll();
      console.log('Magasins data:', response); // Debug
      const data = Array.isArray(response) ? response : [];
      setMagasins(data);
      setFilteredMagasins(data);
    } catch (error) {
      console.error('Erreur magasins:', error);
      showSnackbar('Erreur lors du chargement', 'error');
      // Données de démonstration si le backend n'est pas disponible
      const demoData = [
        {
          id: 1,
          nom: 'Magasin Principal',
          adresse: '123 Rue Test',
          ville: 'Paris',
          pays: 'France'
        }
      ];
      setMagasins(demoData);
      setFilteredMagasins(demoData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMagasins();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMagasins(magasins);
    } else {
      const filtered = magasins.filter(m =>
        m.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.localisation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.ville?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.responsable?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMagasins(filtered);
      setPage(0);
    }
  }, [searchTerm, magasins]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenModal = (mode, magasin = null) => {
    setModalMode(mode);
    setSelectedMagasin(magasin);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMagasin(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (modalMode === 'add') {
        await magasinService.create(formData);
        showSnackbar('Magasin ajouté avec succès');
      } else if (modalMode === 'edit') {
        await magasinService.update(selectedMagasin.id, formData);
        showSnackbar('Magasin modifié avec succès');
      }
      handleCloseModal();
      loadMagasins();
    } catch (error) {
      showSnackbar('Une erreur est survenue', 'error');
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

  const getTypeLabel = (type) => {
    switch (type) {
      case 'principal': return 'Principal';
      case 'secondaire': return 'Secondaire';
      case 'depot': return 'Dépôt';
      case 'chantier': return 'Chantier';
      default: return type;
    }
  };

  const columns = [
    {
      field: 'nom',
      headerName: 'Nom',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true
    },
    {
      field: 'adresse',
      headerName: 'Adresse',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => params.row?.adresse || '—'
    },
    {
      field: 'ville',
      headerName: 'Ville',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => params.row?.ville || '—'
    },
    {
      field: 'pays',
      headerName: 'Pays',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => params.row?.pays || '—'
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
  ];


  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
        Gestion des Magasins
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Rechercher un magasin..."
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
          Nouveau magasin
        </Button>
      </Box>

      <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <DataGrid
          rows={filteredMagasins}
          columns={columns}
          rowCount={filteredMagasins.length}
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
            count={filteredMagasins.length}
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
          modalMode === 'add' ? 'Ajouter un magasin' :
            modalMode === 'edit' ? 'Modifier le magasin' :
              'Détails du magasin'
        }
        onSubmit={modalMode !== 'view' ? handleSubmit : null}
        submitText={modalMode === 'add' ? 'Ajouter' : modalMode === 'edit' ? 'Modifier' : ''}
        maxWidth="sm"
      >
        <MagasinModal
          mode={modalMode}
          initialData={selectedMagasin}
        />
      </FormModal>

      <ConfirmDialog
        open={confirmDelete.open}
        title="Confirmation de suppression"
        message="Voulez-vous vraiment supprimer ce magasin ?"
        confirmText="Oui"
        cancelText="Non"
        onConfirm={async () => {
          try {
            await magasinService.delete(confirmDelete.id);
            showSnackbar('Magasin supprimé avec succès');
            loadMagasins();
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

export default MagasinsPage;