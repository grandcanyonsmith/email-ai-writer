const express = require('express');
const emailController = require('../controllers/emailController');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate email sequence
router.post('/generate-sequence', auth, (req, res) => emailController.generateSequence(req, res));

// Edit email with AI
router.post('/edit-email', auth, (req, res) => emailController.editEmail(req, res));

// List all sequences
router.get('/sequences', auth, (req, res) => emailController.getSequences(req, res));
// Get a single sequence
router.get('/sequences/:id', auth, (req, res) => emailController.getSequence(req, res));
// Update a sequence
router.put('/sequences/:id', auth, (req, res) => emailController.updateSequence(req, res));
// Delete a sequence
router.delete('/sequences/:id', auth, (req, res) => emailController.deleteSequence(req, res));

// User auth endpoints
router.post('/signup', (req, res) => userController.signup(req, res));
router.post('/login', (req, res) => userController.login(req, res));
router.get('/me', auth, (req, res) => userController.me(req, res));
router.get('/profile', auth, (req, res) => userController.getProfile(req, res));
router.put('/profile', auth, (req, res) => userController.updateProfile(req, res));

module.exports = router; 