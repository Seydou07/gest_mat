const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const { protect, admin } = require('../middleware/authMiddleware');

// En développement, on désactive l'auth pour faciliter les tests
const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  router.use(protect);
}

router.get('/', agentController.getAllAgents);
router.get('/:id', agentController.getAgentById);

// En prod : admin requis, en dev : accès libre
if (isProd) {
  router.post('/', admin, agentController.createAgent);
  router.put('/:id', admin, agentController.updateAgent);
  router.delete('/:id', admin, agentController.deleteAgent);
} else {
  router.post('/', agentController.createAgent);
  router.put('/:id', agentController.updateAgent);
  router.delete('/:id', agentController.deleteAgent);
}

module.exports = router;