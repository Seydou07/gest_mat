// pages/historique/index.jsx - Version simplifiée sans DatePicker
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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { frFR } from '@mui/x-data-grid/locales';
import {
  History as HistoryIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Computer as ComputerIcon,
  Assignment as AssignmentIcon,
  SwapHoriz as SwapIcon
} from '@mui/icons-material';

import historiqueService from '../../services/historiqueService';

const HistoriquePage = () => {
  const [historique, setHistorique] = useState([]);
  const [filteredHistorique, setFilteredHistorique] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('tous');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadHistorique = async () => {
    setLoading(true);
    try {
      const response = await historiqueService.getAll();
      console.log('Historique data:', response); // Debug
      const data = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
      setHistorique(data);
      setFilteredHistorique(data);
    } catch (error) {
      console.error('Erreur historique:', error);
      showSnackbar('Erreur lors du chargement de l\'historique', 'error');
      // Données de démonstration si le backend n'est pas disponible
      const demoData = [
        {
          id: 1,
          date_mouvement: new Date().toISOString(),
          type_mouvement: 'affectation',
          ancienAgent: { nom: 'Ancien', prenom: 'Agent' },
          nouvelAgent: { nom: 'Nouveau', prenom: 'Agent' },
          Materiel: { libelle: 'Matériel Test' },
          commentaire: 'Test d\'affectation'
        }
      ];
      setHistorique(demoData);
      setFilteredHistorique(demoData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistorique();
  }, []);

  // Filtres combinés
  useEffect(() => {
    let filtered = historique;

    // Filtre par type
    if (typeFilter !== 'tous') {
      filtered = filtered.filter(item => item.type_mouvement === typeFilter);
    }

    // Filtre par date
    if (dateDebut) {
      filtered = filtered.filter(item => new Date(item.date_mouvement) >= new Date(dateDebut));
    }
    if (dateFin) {
      filtered = filtered.filter(item => new Date(item.date_mouvement) <= new Date(dateFin));
    }

    // Filtre par recherche
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(item => 
        item.ancienAgent?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ancienAgent?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nouvelAgent?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nouvelAgent?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type_mouvement?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.commentaire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Materiel?.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Materiel?.numero_serie?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredHistorique(filtered);
    setPage(0);
  }, [searchTerm, typeFilter, dateDebut, dateFin, historique]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleExport = async (format) => {
    try {
      const blob = await historiqueService.export(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `historique.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showSnackbar(`Export ${format.toUpperCase()} réussi`);
    } catch (error) {
      showSnackbar('Erreur lors de l\'export', 'error');
    }
  };

  const handleRefresh = () => {
    loadHistorique();
    showSnackbar('Historique actualisé');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'affectation': return <SwapIcon fontSize="small" />;
      case 'agent': return <PersonIcon fontSize="small" />;
      case 'materiel': return <ComputerIcon fontSize="small" />;
      case 'projet': return <AssignmentIcon fontSize="small" />;
      default: return <HistoryIcon fontSize="small" />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'affectation': return '#8b5cf6';
      case 'agent': return '#3b82f6';
      case 'materiel': return '#f59e0b';
      case 'projet': return '#10b981';
      default: return '#999';
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'affectation': return 'Affectation';
      case 'agent': return 'Agent';
      case 'materiel': return 'Matériel';
      case 'projet': return 'Projet';
      default: return type;
    }
  };

  const columns = [
    {
      field: 'date_mouvement',
      headerName: 'Date & Heure',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (value, row) => {
        if (!value) return '';
        return new Date(value).toLocaleString('fr-FR');
      }
    },
    {
      field: 'type_mouvement',
      headerName: 'Type',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Chip
          icon={getTypeIcon(params.value)}
          label={getTypeLabel(params.value)}
          size="small"
          sx={{
            bgcolor: `${getTypeColor(params.value)}20`,
            color: getTypeColor(params.value),
            fontWeight: 500,
            fontSize: '0.7rem',
            '& .MuiChip-icon': {
              color: getTypeColor(params.value)
            }
          }}
        />
      )
    },
    {
      field: 'Materiel',
      headerName: 'Matériel',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (value, row) => {
        if (!value) return '—';
        return value.libelle || value.numero_serie || '—';
      }
    },
    {
      field: 'ancienAgent',
      headerName: 'Ancien Agent',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (value, row) => {
        if (!value) return '—';
        return `${value.nom} ${value.prenom}`;
      }
    },
    {
      field: 'nouvelAgent',
      headerName: 'Nouvel Agent',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (value, row) => {
        if (!value) return '—';
        return `${value.nom} ${value.prenom}`;
      }
    },
    {
      field: 'commentaire',
      headerName: 'Détails',
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (value, row) => {
        return row?.commentaire || '—';
      }
    }
  ];
  

  const typeOptions = [
    { value: 'tous', label: 'Tous les types' },
    { value: 'affectation', label: 'Affectations' },
    { value: 'agent', label: 'Agents' },
    { value: 'materiel', label: 'Matériels' },
    { value: 'projet', label: 'Projets' }
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
        Historique des mouvements
      </Typography>

      {/* Filtres */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#999' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                label="Type"
              >
                {typeOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Date début"
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Date fin"
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Tooltip title="Actualiser">
                <Button
                  variant="outlined"
                  onClick={handleRefresh}
                  startIcon={<RefreshIcon />}
                  size="small"
                >
                  Actualiser
                </Button>
              </Tooltip>
              <Tooltip title="Exporter en CSV">
                <Button
                  variant="outlined"
                  onClick={() => handleExport('csv')}
                  startIcon={<DownloadIcon />}
                  size="small"
                >
                  Export
                </Button>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tableau */}
      <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <DataGrid
          rows={filteredHistorique}
          columns={columns}
          rowCount={filteredHistorique.length}
          loading={loading}
          disableSelectionOnClick
          disableColumnMenu={true}
          disableColumnFilter={true}
          disableColumnSelector={true}
          disableDensitySelector={true}
          hideFooter={true}
          getRowId={(row) => row.id || Math.random()}
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
            count={filteredHistorique.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
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

export default HistoriquePage;