const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Email AI Writer API is running!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      generate: '/api/generate-sequence'
    }
  });
});

// Mock email generation endpoint (for testing)
app.post('/api/generate-sequence', (req, res) => {
  const businessData = req.body;
  
  // Validate required fields
  if (!businessData.businessName || !businessData.targetAudience || !businessData.leadMagnet) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      required: ['businessName', 'targetAudience', 'leadMagnet']
    });
  }

  // Create a mock email sequence
  const sequence = {
    id: `seq_${Date.now()}`,
    businessName: businessData.businessName,
    businessDescription: businessData.businessDescription,
    targetAudience: businessData.targetAudience,
    leadMagnet: businessData.leadMagnet,
    primaryCTA: businessData.primaryCTA,
    secondaryCTA: businessData.secondaryCTA,
    heroJourney: businessData.heroJourney,
    resources: businessData.resources,
    emails: [
      {
        type: 'lead_in',
        subject: `Welcome to ${businessData.businessName}!`,
        content: `Hi there!\n\nThank you for downloading our ${businessData.leadMagnet}. We're excited to help you succeed with ${businessData.businessDescription}.\n\nBest regards,\nThe ${businessData.businessName} Team`,
        order: 1
      },
      {
        type: 'engage',
        subject: `How to get the most from your ${businessData.leadMagnet}`,
        content: `Hi!\n\nI hope you're finding value in the ${businessData.leadMagnet} you downloaded.\n\nHere are 3 quick tips to maximize your results:\n\n1. Tip one\n2. Tip two\n3. Tip three\n\nLet me know if you have any questions!\n\nBest,\nThe ${businessData.businessName} Team`,
        order: 2
      },
      {
        type: 'guide',
        subject: `Ready to take the next step?`,
        content: `Hi!\n\nBased on your interest in ${businessData.leadMagnet}, I think you'd love our comprehensive solution.\n\nWould you like to book a call to discuss how we can help you achieve your goals?\n\nBest regards,\nThe ${businessData.businessName} Team`,
        order: 3
      }
    ],
    emailCount: 3,
    distribution: {
      leadIn: 1,
      engage: 1,
      guide: 1,
      offer: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  res.json({ 
    success: true, 
    sequence,
    message: `Successfully generated ${sequence.emails.length} emails`
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Email AI Writer API running on port ${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API docs: http://localhost:${PORT}/`);
}); 