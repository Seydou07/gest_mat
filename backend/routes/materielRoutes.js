const express = require('express');
const router = express.Router();
const materielController = require('../controllers/materielController');
const { protect, admin } = require('../middleware/authMiddleware');

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  router.use(protect);
}

router.get('/', materielController.getAllMateriels);
router.get('/:id', materielController.getMaterielById);

if (isProd) {
  router.post('/', admin, materielController.createMateriel);
  router.put('/:id', admin, materielController.updateMateriel);
  router.delete('/:id', admin, materielController.deleteMateriel);
} else {
  router.post('/', materielController.createMateriel);
  router.put('/:id', materielController.updateMateriel);
  router.delete('/:id', materielController.deleteMateriel);
}

module.exports = router;