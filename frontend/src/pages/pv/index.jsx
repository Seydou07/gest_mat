// pages/pv/index.jsx
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
  Search as SearchIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

import FormModal from '../../components/Modals/FormModal';
import ConfirmDialog from '../../components/Modals/ConfirmDialog';
import PvModal from './PvModal';
import pvService from '../../services/pvService';

const PvPage = () => {
  const [pvs, setPvs] = useState([]);
  const [filteredPvs, setFilteredPvs] = useState([]);
  const [agents, setAgents] = useState([]);
  const [marches, setMarches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPv, setSelectedPv] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [pvsData, agentsData, marchesData] = await Promise.all([
        pvService.getAll(),
        pvService.getAgents(),
        pvService.getMarches()
      ]);

      setPvs(pvsData);
      setFilteredPvs(pvsData);
      setAgents(agentsData);
      setMarches(marchesData);
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
      setFilteredPvs(pvs);
    } else {
      const filtered = pvs.filter(pv =>
        pv.numero_marche?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pv.objet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pv.lieu?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPvs(filtered);
      setPage(0);
    }
  }, [searchTerm, pvs]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenModal = (mode, pv = null) => {
    setModalMode(mode);
    setSelectedPv(pv);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPv(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (modalMode === 'add') {
        await pvService.create(formData);
        showSnackbar('PV ajouté avec succès');
      } else if (modalMode === 'edit') {
        await pvService.update(selectedPv.id, formData);
        showSnackbar('PV modifié avec succès');
      }
      handleCloseModal();
      loadAllData();
    } catch (error) {
      showSnackbar('Une erreur est survenue', 'error');
    }
  };

  const handleDelete = (id) => {
    setConfirmDelete({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    try {
      await pvService.delete(confirmDelete.id);
      showSnackbar('PV supprimé avec succès');
      loadAllData();
    } catch (error) {
      showSnackbar('Erreur lors de la suppression', 'error');
    } finally {
      setConfirmDelete({ open: false, id: null });
    }
  };

  const handleDownload = async (id) => {
    try {
      const blob = await pvService.downloadFile(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pv-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      showSnackbar('Erreur lors du téléchargement', 'error');
    }
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
      field: 'numero_marche',
      headerName: 'N° Marché',
      flex: 1,
      sortable: false,
      disableColumnMenu: true
    },
    {
      field: 'objet',
      headerName: 'Objet',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true
    },
    {
      field: 'date_reception',
      headerName: 'Date réception',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (!params.row || !params.row.date_reception) return '—';
        return new Date(params.row.date_reception).toLocaleDateString('fr-FR');
      }
    },
    {
      field: 'lieu',
      headerName: 'Lieu',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => params.row?.lieu || '—'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} justifyContent="center">
          <Tooltip title="Voir détails">
            <IconButton color="info" size="small" onClick={() => handleOpenModal('view', params.row)}>
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {params.row.fichier && (
            <Tooltip title="Télécharger">
              <IconButton color="success" size="small" onClick={() => handleDownload(params.row.id)}>
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

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
        PV de Réception
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Rechercher un PV..."
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
          Nouveau PV
        </Button>
      </Box>

      <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <DataGrid
          rows={filteredPvs}
          columns={columns}
          rowCount={filteredPvs.length}
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
            count={filteredPvs.length}
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
          modalMode === 'add' ? 'Nouveau PV de réception' :
            modalMode === 'edit' ? 'Modifier le PV' :
              'Détails du PV'
        }
        onSubmit={modalMode !== 'view' ? handleSubmit : null}
        submitText={modalMode === 'add' ? 'Créer' : modalMode === 'edit' ? 'Modifier' : ''}
        maxWidth="md"
      >
        <PvModal
          mode={modalMode}
          initialData={selectedPv}
          agents={agents}
          marches={marches}
        />
      </FormModal>

      <ConfirmDialog
        open={confirmDelete.open}
        title="Confirmation de suppression"
        message="Voulez-vous vraiment supprimer ce PV ?"
        confirmText="Oui"
        cancelText="Non"
        onConfirm={handleConfirmDelete}
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

export default PvPage;