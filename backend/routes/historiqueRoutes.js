// routes/historiqueRoutes.js
const express = require('express');
const router = express.Router();
const historiqueController = require('../controllers/historiqueController');
const { protect } = require('../middleware/authMiddleware');

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  router.use(protect);
}

router.get('/', historiqueController.getAll);
router.get('/materiel/:id', historiqueController.getByMateriel);
router.get('/type/:type', historiqueController.getByType);
router.get('/export', historiqueController.export);

module.exports = router;