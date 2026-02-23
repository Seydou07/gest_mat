// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

// Import des routes
const authRoutes = require('./routes/authRoutes');
const projetRoutes = require('./routes/projetRoutes');
const agentRoutes = require('./routes/agentRoutes');
const materielRoutes = require('./routes/materielRoutes');
const affectationRoutes = require('./routes/affectationRoutes');
const configRoutes = require('./routes/configRoutes');
const pvRoutes = require('./routes/pvRoutes');
const historiqueRoutes = require('./routes/historiqueRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dossier static pour les uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API Gestion Matériel - Bienvenue !' });
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/projets', projetRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/materiels', materielRoutes);
app.use('/api/affectations', affectationRoutes);
app.use('/api/config', configRoutes);
app.use('/api/pv', pvRoutes);
app.use('/api/historique', historiqueRoutes);
app.use('/api/stats', statsRoutes);

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Synchronisation avec la base de données
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connexion à la base de données réussie');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Modèles synchronisés');

    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur de connexion à la DB:', err);
  });