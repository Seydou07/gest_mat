// routes/configRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

// Importer tous les contrôleurs de configuration
const fonctionController = require('../controllers/fonctionController');
const marqueController = require('../controllers/marqueController');
const typeMaterielController = require('../controllers/typeMaterielController');
const localisationController = require('../controllers/localisationController');
const etatMaterielController = require('../controllers/etatMaterielController');

// En développement, on laisse ces routes accessibles sans auth
const isProd = process.env.NODE_ENV === 'production';

// Routes pour Fonctions
router.get('/fonctions', isProd ? protect : (req, res, next) => next(), fonctionController.getAll);
router.get('/fonctions/:id', isProd ? protect : (req, res, next) => next(), fonctionController.getById);
router.post(
  '/fonctions',
  ...(isProd ? [protect, admin] : []),
  fonctionController.create
);
router.put(
  '/fonctions/:id',
  ...(isProd ? [protect, admin] : []),
  fonctionController.update
);
router.delete(
  '/fonctions/:id',
  ...(isProd ? [protect, admin] : []),
  fonctionController.delete
);

// Routes pour Marques
router.get('/marques', isProd ? protect : (req, res, next) => next(), marqueController.getAll);
router.get('/marques/:id', isProd ? protect : (req, res, next) => next(), marqueController.getById);
router.post(
  '/marques',
  ...(isProd ? [protect, admin] : []),
  marqueController.create
);
router.put(
  '/marques/:id',
  ...(isProd ? [protect, admin] : []),
  marqueController.update
);
router.delete(
  '/marques/:id',
  ...(isProd ? [protect, admin] : []),
  marqueController.delete
);

// Routes pour Types de matériel
router.get('/types-materiel', isProd ? protect : (req, res, next) => next(), typeMaterielController.getAll);
router.get('/types-materiel/:id', isProd ? protect : (req, res, next) => next(), typeMaterielController.getById);
router.post(
  '/types-materiel',
  ...(isProd ? [protect, admin] : []),
  typeMaterielController.create
);
router.put(
  '/types-materiel/:id',
  ...(isProd ? [protect, admin] : []),
  typeMaterielController.update
);
router.delete(
  '/types-materiel/:id',
  ...(isProd ? [protect, admin] : []),
  typeMaterielController.delete
);

// Routes pour Localisations
router.get('/localisations', isProd ? protect : (req, res, next) => next(), localisationController.getAll);
router.get('/localisations/:id', isProd ? protect : (req, res, next) => next(), localisationController.getById);
router.post(
  '/localisations',
  ...(isProd ? [protect, admin] : []),
  localisationController.create
);
router.put(
  '/localisations/:id',
  ...(isProd ? [protect, admin] : []),
  localisationController.update
);
router.delete(
  '/localisations/:id',
  ...(isProd ? [protect, admin] : []),
  localisationController.delete
);

// Routes pour États de matériel
router.get('/etats-materiel', isProd ? protect : (req, res, next) => next(), etatMaterielController.getAll);
router.get('/etats-materiel/:id', isProd ? protect : (req, res, next) => next(), etatMaterielController.getById);
router.post(
  '/etats-materiel',
  ...(isProd ? [protect, admin] : []),
  etatMaterielController.create
);
router.put(
  '/etats-materiel/:id',
  ...(isProd ? [protect, admin] : []),
  etatMaterielController.update
);
router.delete(
  '/etats-materiel/:id',
  ...(isProd ? [protect, admin] : []),
  etatMaterielController.delete
);

module.exports = router;