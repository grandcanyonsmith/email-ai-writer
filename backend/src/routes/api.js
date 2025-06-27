const express = require('express');
const emailController = require('../controllers/emailController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Generate email sequence
router.post('/generate-sequence', (req, res) => emailController.generateSequence(req, res));

// Edit email with AI
router.post('/edit-email', (req, res) => emailController.editEmail(req, res));

// Backup all sequences as zip
router.get('/sequences/backup', (req, res) => emailController.backupSequences(req, res));
// Restore sequences from zip
router.post('/sequences/restore', upload.single('backup'), (req, res) => emailController.restoreSequences(req, res));

module.exports = router; 