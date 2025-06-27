const express = require('express');
const emailController = require('../controllers/emailController');

const router = express.Router();

// Generate email sequence
router.post('/generate-sequence', (req, res) => emailController.generateSequence(req, res));

// Edit email with AI
router.post('/edit-email', (req, res) => emailController.editEmail(req, res));

module.exports = router; 