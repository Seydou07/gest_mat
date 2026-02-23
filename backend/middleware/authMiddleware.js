// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = 'votre_secret_key_tres_longue_et_securisee_123456789';

// Vérifier si l'utilisateur est authentifié
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Récupérer le token du header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Vous n\'êtes pas connecté' });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Récupérer l'utilisateur
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur auth:', error);
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

// Vérifier si l'utilisateur est admin
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Accès réservé aux administrateurs' });
  }
};