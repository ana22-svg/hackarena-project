const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /api/users/login - Login
router.post('/login', userController.login);  // ← ADD THIS

// POST /api/users - Create a new user
router.post('/', userController.createUser);

// GET /api/users - Get all users
router.get('/', userController.getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', userController.getUserById);

// GET /api/users/:id/trust-score - Get trust score with breakdown
router.get('/:id/trust-score', userController.getTrustScore);

module.exports = router;