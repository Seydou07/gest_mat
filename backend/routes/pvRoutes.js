// routes/pvRoutes.js
const express = require('express');
const router = express.Router();
const pvController = require('../controllers/pvController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  router.use(protect);
}

router.get('/', pvController.getAll);
router.get('/:id', pvController.getById);
router.get('/:id/download', pvController.downloadFile);

if (isProd) {
  router.post('/', admin, upload.single('fichier'), pvController.create);
  router.put('/:id', admin, pvController.update);
  router.delete('/:id', admin, pvController.delete);
} else {
  router.post('/', upload.single('fichier'), pvController.create);
  router.put('/:id', pvController.update);
  router.delete('/:id', pvController.delete);
}

module.exports = router;