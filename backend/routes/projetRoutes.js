// routes/projetRoutes.js
const express = require('express');
const router = express.Router();
const projetController = require('../controllers/projetController');
const { protect, admin } = require('../middleware/authMiddleware');

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  router.use(protect);
}

router.get('/', projetController.getAllProjets);
router.get('/:id', projetController.getProjetById);

if (isProd) {
  router.post('/', admin, projetController.createProjet);
  router.put('/:id', admin, projetController.updateProjet);
  router.delete('/:id', admin, projetController.deleteProjet);
} else {
  router.post('/', projetController.createProjet);
  router.put('/:id', projetController.updateProjet);
  router.delete('/:id', projetController.deleteProjet);
}

module.exports = router;