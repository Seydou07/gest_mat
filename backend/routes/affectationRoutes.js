const express = require('express');
const router = express.Router();
const affectationController = require('../controllers/affectationController');
const { protect, admin } = require('../middleware/authMiddleware');

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  router.use(protect);
}

router.get('/', affectationController.getAllAffectations);
router.get('/:id', affectationController.getAffectationById);

if (isProd) {
  router.post('/', admin, affectationController.createAffectation);
  router.put('/:id', admin, affectationController.updateAffectation);
  router.delete('/:id', admin, affectationController.deleteAffectation);
} else {
  router.post('/', affectationController.createAffectation);
  router.put('/:id', affectationController.updateAffectation);
  router.delete('/:id', affectationController.deleteAffectation);
}

module.exports = router;