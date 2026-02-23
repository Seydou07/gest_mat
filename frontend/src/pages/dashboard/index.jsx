// src/pages/dashboard/DashboardPage.js
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  PeopleAlt as PeopleIcon,
  Work as WorkIcon,
  Build as BuildIcon,
  SwapHoriz as SwapIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import dashboardService from '../../services/dashboardService';

// Données graphiques (gardées car pas d'historique mensuel côté backend)
const monthlyData = [
  { name: 'Jan', affectations: 0, acquisitions: 0 },
  { name: 'Fév', affectations: 0, acquisitions: 0 },
  { name: 'Mar', affectations: 0, acquisitions: 0 },
  { name: 'Avr', affectations: 0, acquisitions: 0 },
  { name: 'Mai', affectations: 0, acquisitions: 0 },
  { name: 'Juin', affectations: 0, acquisitions: 0 },
  { name: 'Juil', affectations: 0, acquisitions: 0 },
  { name: 'Août', affectations: 0, acquisitions: 0 },
  { name: 'Sep', affectations: 0, acquisitions: 0 },
  { name: 'Oct', affectations: 0, acquisitions: 0 },
  { name: 'Nov', affectations: 0, acquisitions: 0 },
  { name: 'Déc', affectations: 0, acquisitions: 0 },
];

const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalAgents: 0,
    totalProjets: 0,
    totalMateriels: 0,
    totalAffectations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Erreur chargement stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const statsCards = [
    { title: 'Total Agents', value: stats.totalAgents, icon: <PeopleIcon sx={{ fontSize: 40 }} />, color: '#3b82f6', bgColor: '#dbeafe' },
    { title: 'Projets Actifs', value: stats.totalProjets, icon: <WorkIcon sx={{ fontSize: 40 }} />, color: '#10b981', bgColor: '#d1fae5' },
    { title: 'Matériels', value: stats.totalMateriels, icon: <BuildIcon sx={{ fontSize: 40 }} />, color: '#f59e0b', bgColor: '#fef3c7' },
    { title: 'Affectations', value: stats.totalAffectations, icon: <SwapIcon sx={{ fontSize: 40 }} />, color: '#8b5cf6', bgColor: '#ede9fe' },
  ];

  // Données du camembert basées sur les stats réelles
  const pieData = [
    { name: 'Agents', value: stats.totalAgents || 0, color: '#3b82f6' },
    { name: 'Projets', value: stats.totalProjets || 0, color: '#10b981' },
    { name: 'Matériels', value: stats.totalMateriels || 0, color: '#f59e0b' },
    { name: 'Affectations', value: stats.totalAffectations || 0, color: '#8b5cf6' },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
      p: 3,
      boxSizing: 'border-box',
    }}>
      {/* En-tête */}
      <Box sx={{ mb: 2, flexShrink: 0 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b' }}>Tableau de bord</Typography>
        <Typography variant="body2" color="text.secondary">Aperçu général de la gestion des agents et matériels</Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 2, flexShrink: 0 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>{stat.title}</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {typeof stat.value === 'number' ? stat.value.toLocaleString('fr-FR') : stat.value}
                    </Typography>
                  </Box>
                  <Box sx={{ bgcolor: stat.bgColor, p: 1, borderRadius: 2 }}>
                    <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Graphiques côte à côte */}
      <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, minHeight: 0, width: '100%' }}>

        {/* Graphique Barres */}
        <Box sx={{ flex: '0 0 65%', minWidth: 0, height: '100%' }}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, flexShrink: 0 }}>Évolution des Mouvements (Jan – Déc)</Typography>
            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="affectations" name="Affectations" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="acquisitions" name="Acquisitions" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

        {/* Graphique Camembert */}
        <Box sx={{ flex: '0 0 35%', minWidth: 0, height: '100%' }}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, flexShrink: 0 }}>Répartition globale</Typography>
            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius="28%"
                    outerRadius="52%"
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, pt: 2, borderTop: '1px solid #e0e0e0', justifyContent: 'center', flexShrink: 0 }}>
              {pieData.map((item) => (
                <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, bgcolor: item.color, borderRadius: '50%' }} />
                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{item.name} ({item.value})</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

      </Box>
    </Box>
  );
};

export default DashboardPage;
