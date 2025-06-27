const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Test server is running!'
  });
});

// Test API route
app.post('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Test endpoint working!',
    data: req.body
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
}); 