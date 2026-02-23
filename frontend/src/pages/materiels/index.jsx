// pages/materiels/index.jsx
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
import MaterielModal from './MaterielModal';
import materielService from '../../services/materielService';

const MaterielsPage = () => {
  const [materiels, setMateriels] = useState([]);
  const [filteredMateriels, setFilteredMateriels] = useState([]);
  const [types, setTypes] = useState([]);
  const [etats, setEtats] = useState([]);
  const [localisations, setLocalisations] = useState([]);
  const [marques, setMarques] = useState([]);
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMateriel, setSelectedMateriel] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [materielsData, typesData, etatsData, localisationsData, marquesData, projetsData] = await Promise.all([
        materielService.getAll(),
        materielService.getTypes(),
        materielService.getEtats(),
        materielService.getLocalisations(),
        materielService.getMarques(),
        materielService.getProjets()
      ]);

      setMateriels(materielsData);
      setFilteredMateriels(materielsData);
      setTypes(typesData);
      setEtats(etatsData);
      setLocalisations(localisationsData);
      setMarques(marquesData);
      setProjets(projetsData);
    } catch (error) {
      showSnackbar('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMateriels(materiels);
    } else {
      const filtered = materiels.filter(m =>
        m.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.numero_serie?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMateriels(filtered);
      setPage(0);
    }
  }, [searchTerm, materiels]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenModal = (mode, materiel = null) => {
    setModalMode(mode);
    setSelectedMateriel(materiel);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMateriel(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (modalMode === 'add') {
        await materielService.create(formData);
        showSnackbar('Matériel ajouté avec succès');
      } else if (modalMode === 'edit') {
        await materielService.update(selectedMateriel.id, formData);
        showSnackbar('Matériel modifié avec succès');
      }
      handleCloseModal();
      loadAllData();
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

  const columns = [
    {
      field: 'libelle',
      headerName: 'Libellé',
      width: 180,
      sortable: false,
      disableColumnMenu: true
    },
    {
      field: 'numero_serie',
      headerName: 'N° Série',
      width: 140,
      sortable: false,
      disableColumnMenu: true
    },
    {
      field: 'type_id',
      headerName: 'Type',
      width: 130,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        // Priorité aux données incluses du backend
        const includedType = params?.row?.TypeMateriel?.nom;
        if (includedType) return includedType;
        // Fallback via liste des types
        const type = types.find(t => t.id === params.row.type_id);
        return type?.nom || '—';
      }
    },
    {
      field: 'etat_id',
      headerName: 'État',
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        // Priorité aux données incluses du backend
        const includedEtat = params?.row?.EtatMateriel;
        const etat = includedEtat || etats.find(e => e.id === params.row.etat_id);
        const color = etat?.couleur || '#999';
        return (
          <Chip
            label={etat?.libelle || '—'}
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
      field: 'localisation_id',
      headerName: 'Localisation',
      width: 140,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        // Priorité aux données incluses du backend
        const includedLoc = params?.row?.Localisation?.nom;
        if (includedLoc) return includedLoc;
        // Fallback via liste des localisations
        const loc = localisations.find(l => l.id === params.row.localisation_id);
        return loc?.nom || '—';
      }
    },
    {
      field: 'marque_id',
      headerName: 'Marque',
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        // Priorité aux données incluses du backend
        const includedMarque = params?.row?.Marque?.nom;
        if (includedMarque) return includedMarque;
        // Fallback via liste des marques
        const marque = marques.find(m => m.id === params.row.marque_id);
        return marque?.nom || '—';
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
        Gestion des Matériels
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Rechercher un matériel..."
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
          Nouveau matériel
        </Button>
      </Box>

      <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <DataGrid
          rows={filteredMateriels.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
          columns={columns}
          rowCount={filteredMateriels.length}
          getRowId={(row) => row.id}
          loading={loading}
          disableSelectionOnClick
          disableColumnMenu={true}
          disableColumnFilter={true}
          disableColumnSelector={true}
          disableDensitySelector={true}
          hideFooter={true}
          autoHeight
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
            count={filteredMateriels.length}
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
          modalMode === 'add' ? 'Ajouter un matériel' :
            modalMode === 'edit' ? 'Modifier le matériel' :
              'Détails du matériel'
        }
        onSubmit={modalMode !== 'view' ? handleSubmit : null}
        submitText={modalMode === 'add' ? 'Ajouter' : modalMode === 'edit' ? 'Modifier' : ''}
        maxWidth="sm"
      >
        <MaterielModal
          mode={modalMode}
          initialData={selectedMateriel}
          types={types}
          etats={etats}
          localisations={localisations}
          marques={marques}
          projets={projets}
        />
      </FormModal>

      <ConfirmDialog
        open={confirmDelete.open}
        title="Confirmation de suppression"
        message="Voulez-vous vraiment supprimer ce matériel ?"
        confirmText="Oui"
        cancelText="Non"
        onConfirm={async () => {
          try {
            await materielService.delete(confirmDelete.id);
            showSnackbar('Matériel supprimé avec succès');
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

export default MaterielsPage;
